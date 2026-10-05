using HireFlow.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Job> Jobs => Set<Job>();

    public DbSet<JobApplication> JobApplications => Set<JobApplication>();

    public DbSet<SavedJob> SavedJobs => Set<SavedJob>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // =========================================================
        // JobApplication -> Job
        // =========================================================

        modelBuilder.Entity<JobApplication>()
            .HasOne(a => a.Job)
            .WithMany()
            .HasForeignKey(a => a.JobId)
            .OnDelete(DeleteBehavior.Cascade);


        // =========================================================
        // JobApplication -> User
        // =========================================================

        modelBuilder.Entity<JobApplication>()
            .HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);


        // =========================================================
        // SavedJob -> User
        // =========================================================

        modelBuilder.Entity<SavedJob>()
            .HasOne(s => s.User)
            .WithMany()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);


        // =========================================================
        // SavedJob -> Job
        // =========================================================

        modelBuilder.Entity<SavedJob>()
            .HasOne(s => s.Job)
            .WithMany()
            .HasForeignKey(s => s.JobId)
            .OnDelete(DeleteBehavior.Cascade);


        // =========================================================
        // Prevent duplicate saved jobs
        // =========================================================

        modelBuilder.Entity<SavedJob>()
            .HasIndex(s => new
            {
                s.UserId,
                s.JobId
            })
            .IsUnique();
    }
}