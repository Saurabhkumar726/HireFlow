namespace HireFlow.Api.Models
{
    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty;
        public decimal Salary { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<JobApplication> Applications { get; set; } = new();
    }
}