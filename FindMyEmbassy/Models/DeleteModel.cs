using System;
using System.ComponentModel.DataAnnotations;

namespace FindMyEmbassy.Models
{
    /// <summary>
    /// Model for: Delete all unnessary files except for the ones needed for the react application in the react folder
    /// User Story: US-374408
    /// </summary>
    public class DeleteModel
    {
        public int Id { get; set; }
        
        // TODO: Add properties based on acceptance criteria
        // Example:
        // [Required]
        // public string Name { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
