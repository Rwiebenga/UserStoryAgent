using System;
using System.ComponentModel.DataAnnotations;

namespace FindMyEmbassy.Models
{
    /// <summary>
    /// Model for: Title: As a user, I want to search embassies by country  Description: Allow users to filter the embassy list by selecting a country from a dropdown
    /// User Story: US-374402
    /// </summary>
    public class SearchModel
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
