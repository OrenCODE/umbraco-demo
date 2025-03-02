using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common;
using Umbraco.Cms.Web.Common.Controllers;
using Umbraco.Extensions;
using UmbracoDemo.Models;

namespace UmbracoDemo.Controllers
{
    [ApiController]
    [Route("umbraco/api/[controller]")]
    public class QuestionnaireApiController : Controller
    {
        private readonly UmbracoHelper _umbracoHelper;
        private readonly IContentService _contentService;

        // private readonly ILogger<QuestionnaireApiController> _logger;

        public QuestionnaireApiController(
            UmbracoHelper umbracoHelper,
            IContentService contentService
        // ILogger<QuestionnaireApiController> logger
        )
        {
            _umbracoHelper = umbracoHelper;
            _contentService = contentService;
            // _logger = logger;
        }

        [HttpGet("GetQuestionnaire")]
        public IActionResult GetQuestionnaire()
        {
            IPublishedContent? investorQuestionnaireContent = _umbracoHelper
                .ContentAtRoot()
                .FirstOrDefault(content => content.ContentType.Alias == "investorQuestionnaire");

            if (investorQuestionnaireContent == null)
            {
                return NotFound("Investor questionnaire content not found");
            }

            // Map the risk profile
            var riskProfile =
                investorQuestionnaireContent.Value<string>("riskProfile") ?? string.Empty;

            // Map the questions and their answers (child nodes)
            var questions = investorQuestionnaireContent
                .Children()
                .Where(child => child.ContentType.Alias == "question")
                .Select(questionContent => new Question
                {
                    QuestionId = questionContent.Id,
                    QuestionText = questionContent.Value<string>("questionText") ?? string.Empty,
                    Answers = questionContent
                        .Children()
                        .Where(child => child.ContentType.Alias == "answer")
                        .Select(answerContent => new Answer
                        {
                            AnswerText = answerContent.Value<string>("answerText") ?? string.Empty,
                            Score = answerContent.Value<int>("score"),
                        })
                        .ToList(),
                })
                .ToList();

            var suggestedProducts = investorQuestionnaireContent
                .Children()
                .Where(child => child.ContentType.Alias == "product")
                .Select(productContent => new Product
                {
                    ProductId = productContent.Id,
                    ProductName = productContent.Value<string>("productName") ?? string.Empty,
                    Description = productContent.Value<string>("description") ?? string.Empty,
                    Image = productContent.Value<IPublishedContent>("image")
                        is IPublishedContent media
                        ? $"{Request.Scheme}://{Request.Host}{media.Url()}"
                        : string.Empty,
                    RiskLevel = productContent.Value<string>("riskLevel") ?? string.Empty,
                    ExpectedReturn = productContent.Value<string>("expectedReturn") ?? string.Empty,
                })
                .ToList();

            var questionnaireModel = new InvestorQuestionnaireModel
            {
                RiskProfile = riskProfile,
                Questions = questions,
                SuggestedProducts = suggestedProducts,
            };

            return Ok(questionnaireModel);
        }

        [HttpPost("SubmitResponse")]
        public IActionResult SubmitResponse([FromBody] UserResponseModel userResponse)
        {
            // 1. Locate the folder where responses are saved
            IPublishedContent? responsesFolder = _umbracoHelper
                .ContentAtRoot()
                .FirstOrDefault(c => c.ContentType.Alias == "responsesFolder");

            if (responsesFolder == null)
            {
                // _logger.LogWarning(
                //     "Responses folder not found. Please create/publish a node with alias 'responsesFolder'."
                // );
                return BadRequest("Responses folder not configured in Umbraco");
            }

            // 2. Create the new content node under that folder
            var nodeName = $"Investor Response {userResponse.SubmittedOn:yyyyMMddHHmmss}";
            var newResponse = _contentService.Create(
                nodeName,
                responsesFolder.Id,
                "investorResponse"
            );

            // 3. Serialize the user response to JSON
            string responseJson = JsonConvert.SerializeObject(userResponse, Formatting.Indented);

            // 4. Set the property (ensure doc type has a property alias 'responseData')
            newResponse.SetValue("responseData", responseJson);

            // 5. Save the content
            var saveResult = _contentService.Save(newResponse);
            if (!saveResult.Success)
            {
                // _logger.LogError(
                //     "Failed to save newResponse. Result: {Result}. Likely mandatory fields or doc type issues.",
                //     saveResult.Result
                // );
                return StatusCode(500, $"Error saving the response. Reason: {saveResult.Result}");
            }

            // 6. Publish the content
            // For a single-language site, pass an empty array of cultures
            // If you have "en-US" configured in Umbraco > Settings > Languages, use new[] { "en-US" }
            var publishResult = _contentService.Publish(newResponse, Array.Empty<string>(), 0);
            if (!publishResult.Success)
            {
                // In Umbraco 15, PublishResult doesn't have an Exception property
                // We just check publishResult.Result for details
                var reason = publishResult.Result.ToString(); // e.g. FailedPublishContentInvalid, FailedPublishMandatory, etc.
                // _logger.LogError("Failed to publish newResponse. Reason: {Reason}", reason);

                return StatusCode(500, $"Error publishing the response: {reason}");
            }

            // _logger.LogInformation(
            //     "Successfully saved and published response node: {NodeName}",
            //     nodeName
            // );
            return Ok(
                new { Message = "Response saved and published successfully", Data = userResponse }
            );
        }
    }
}
