using System.Collections.Generic;

namespace UmbracoDemo.Models
{
    public class InvestorQuestionnaireModel
    {
        // Initialize with an empty list and string.Empty as a default value.
        public List<Question> Questions { get; set; } = new List<Question>();
        public string RiskProfile { get; set; } = string.Empty;
        public List<Product> SuggestedProducts { get; set; } = new List<Product>();
    }

    public class Question
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public List<Answer> Answers { get; set; } = new List<Answer>();
    }

    public class Answer
    {
        public string AnswerText { get; set; } = string.Empty;
        public int Score { get; set; }
    }

    public class Product
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string RiskLevel { get; set; } = string.Empty;
        public string ExpectedReturn { get; set; } = string.Empty;
    }

    public class UserResponseModel
    {
        public DateTime SubmittedOn { get; set; }
        public List<UserAnswer> Answers { get; set; } = new List<UserAnswer>();
    }

    public class UserAnswer
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string SelectedAnswer { get; set; } = string.Empty;
        public int Score { get; set; }
    }
}
