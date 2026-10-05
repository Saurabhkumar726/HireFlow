namespace HireFlow.API.DTOs;

public class CreateJobApplicationRequest
{
    public int JobId { get; set; }

    public string ResumeUrl { get; set; } = string.Empty;

    public string CoverLetter { get; set; } = string.Empty;
}