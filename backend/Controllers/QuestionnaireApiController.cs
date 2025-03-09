using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Umbraco.Cms.Core.Models.Blocks;
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

        public QuestionnaireApiController(
            UmbracoHelper umbracoHelper,
            IContentService contentService
        )
        {
            _umbracoHelper = umbracoHelper;
            _contentService = contentService;
        }

        [HttpGet("GetQuestionnaire")]
        public IActionResult GetQuestionnaire()
        {
            // 1) Locate the "investorQuestionnaire" node at root
            var investorQuestionnaire = _umbracoHelper
                .ContentAtRoot()
                .FirstOrDefault(x => x.ContentType.Alias == "investorQuestionnaire");

            if (investorQuestionnaire is null)
                return NotFound("Investor questionnaire content not found");

            // 2) Read the "riskProfile" property
            var riskProfile = investorQuestionnaire.Value<string>("riskProfile") ?? string.Empty;

            // 3) Parse the "questions" block list
            var questions = new List<Question>();
            var questionsBlock = investorQuestionnaire.Value<BlockListModel>("questions");

            if (questionsBlock is not null)
            {
                foreach (var item in questionsBlock)
                {
                    if (item.Content.ContentType.Alias == "question")
                    {
                        var qContent = item.Content;
                        var questionText = qContent.Value<string>("questionText") ?? string.Empty;

                        // "answers" is another block list
                        var answers = new List<Answer>();
                        var answersBlock = qContent.Value<BlockListModel>("answers");
                        if (answersBlock is not null)
                        {
                            foreach (var ansItem in answersBlock)
                            {
                                if (ansItem.Content.ContentType.Alias == "answer")
                                {
                                    var aContent = ansItem.Content;
                                    var answerText =
                                        aContent.Value<string>("answerText") ?? string.Empty;
                                    var score = aContent.Value<int>("score");

                                    answers.Add(
                                        new Answer
                                        {
                                            AnswerId = aContent.Key,
                                            AnswerText = answerText,
                                            Score = score,
                                        }
                                    );
                                }
                            }
                        }

                        questions.Add(
                            new Question
                            {
                                QuestionId = qContent.Key,
                                QuestionText = questionText,
                                Answers = answers,
                            }
                        );
                    }
                }
            }

            // 4) Parse the "suggestedProducts" block list
            var suggestedProducts = new List<Product>();
            var productsBlock = investorQuestionnaire.Value<BlockListModel>("suggestedProducts");

            if (productsBlock is not null)
            {
                foreach (var productItem in productsBlock)
                {
                    if (productItem.Content.ContentType.Alias == "product")
                    {
                        var pContent = productItem.Content;
                        var productName = pContent.Value<string>("productName") ?? string.Empty;
                        var description = pContent.Value<string>("description") ?? string.Empty;
                        var riskLevel = pContent.Value<string>("riskLevel") ?? string.Empty;
                        var expectedReturn =
                            pContent.Value<string>("expectedReturn") ?? string.Empty;

                        var imageMedia = pContent.Value<IPublishedContent>("image");
                        var imageUrl = imageMedia is not null
                            ? $"{Request.Scheme}://{Request.Host}{imageMedia.Url()}"
                            : string.Empty;

                        suggestedProducts.Add(
                            new Product
                            {
                                ProductId = pContent.Key,
                                ProductName = productName,
                                Description = description,
                                Image = imageUrl,
                                RiskLevel = riskLevel,
                                ExpectedReturn = expectedReturn,
                            }
                        );
                    }
                }
            }

            // 5) Build the final model
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
            // 1) Locate the folder where responses are saved
            var responsesFolder = _umbracoHelper
                .ContentAtRoot()
                .FirstOrDefault(x => x.ContentType.Alias == "responsesFolder");

            if (responsesFolder is null)
                return BadRequest("Responses folder not configured in Umbraco");

            // 2) Create the new content node under that folder
            var nodeName = $"Investor Response {userResponse.SubmittedOn:yyyyMMddHHmmss}";
            var newResponse = _contentService.Create(
                nodeName,
                responsesFolder.Id,
                "investorResponse"
            );

            // 3) Serialize the user response to JSON
            var responseJson = JsonConvert.SerializeObject(userResponse, Formatting.Indented);

            // 4) Set the property (ensure doc type has a property alias 'responseData')
            newResponse.SetValue("responseData", responseJson);

            // 5) Save the content
            var saveResult = _contentService.Save(newResponse);
            if (!saveResult.Success)
                return StatusCode(500, $"Error saving the response. Reason: {saveResult.Result}");

            // 6) Publish the content
            var publishResult = _contentService.Publish(newResponse, Array.Empty<string>(), 0);
            if (!publishResult.Success)
            {
                var reason = publishResult.Result.ToString();
                return StatusCode(500, $"Error publishing the response: {reason}");
            }

            return Ok(
                new { Message = "Response saved and published successfully", Data = userResponse }
            );
        }

        [HttpGet("GetResponses")]
        public IActionResult GetResponses()
        {
            // 1) Locate the folder where responses are stored
            var responsesFolder = _umbracoHelper
                .ContentAtRoot()
                .FirstOrDefault(x => x.ContentType.Alias == "responsesFolder");

            if (responsesFolder is null)
                return NotFound("Responses folder not found");

            // 2) For each child node with doc type alias "investorResponse", read its "responseData"
            var investorResponses = responsesFolder
                .Children()
                .Where(x => x.ContentType.Alias == "investorResponse");

            var results = new List<UserResponseModel>();

            foreach (var responseNode in investorResponses)
            {
                var json = responseNode.Value<string>("responseData");
                if (!string.IsNullOrWhiteSpace(json))
                {
                    try
                    {
                        var userResponse = JsonConvert.DeserializeObject<UserResponseModel>(json);
                        if (userResponse is not null)
                            results.Add(userResponse);
                    }
                    catch
                    {
                        // Optionally log or handle parse errors
                    }
                }
            }

            // 3) Return all parsed user responses
            return Ok(results);
        }
    }
}
