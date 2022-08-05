using API.Data;
using API.Models;
using API.Repository;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace API.Tests.Repository;

public class EventRepositoryTests
{
    private async Task<DataContext> GetDatabaseContext()
    {
        var options = new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        var databaseContext = new DataContext(options);
        databaseContext.Database.EnsureCreated();
        if (await databaseContext.Events.CountAsync() <= 0)
        {
            for (int i = 1; i <= 10; i++) // Create 10 (fake) db records
            {
                databaseContext.Events.Add(
                new Event()
                {
                    Title = $"Event {i}",
                });
                await databaseContext.SaveChangesAsync();
            }
        }
        return databaseContext;
    }

    [Fact]
    public async Task EventRepository_ExistsAsync_ReturnsTrue()
    {
        // Arrange
        var title = "Event 1";
        var context = await GetDatabaseContext();
        var eventRepository = new EventRepository(context);


        // Assert
        var result = await eventRepository.ExistsAsync(e => e.Title == title);

        // Act
        result.Should().BeTrue();
    }

    [Fact]
    public async Task EventRepository_GetSome_ReturnsEvents()
    {
        // Arrange
        var titleSet = new HashSet<string>()
        {
            "Event 1",
            "Event 3"
        };
        var context = await GetDatabaseContext();
        var eventRepository = new EventRepository(context);

        // Assert
        var result = eventRepository.GetSome(e => titleSet.Contains(e.Title));

        // Act
        result.Should().NotBeNull();
    }

    [Fact]
    public async Task EventRepository_GetAllAsync_ReturnsEvents()
    {
        // Arrange
        var context = await GetDatabaseContext();
        var eventRepository = new EventRepository(context);

        // Assert
        var result = await eventRepository.GetAllAsync();

        // Act
        result.Should().BeOfType<List<Event>>();
    }

    [Fact]
    public async Task EventRepository_GetByIdAsync_ReturnsEvents()
    {
        // Arrange
        var eventId = 1;
        var context = await GetDatabaseContext();
        var eventRepository = new EventRepository(context);

        // Assert
        var result = await eventRepository.GetByIdAsync(eventId);

        // Act
        result.Should().BeOfType<Event>();
    }

    [Fact]
    public async Task EventRepository_RemoveAsync_ReturnsTrue()
    {
        // Arrange
        var eventToBeDelete = new Event()
        {
            Title = "Event 1"
        };
        var context = await GetDatabaseContext();
        var eventRepository = new EventRepository(context);

        // Assert
        var result = await eventRepository.RemoveAsync(eventToBeDelete);

        // Act
        result.Should().BeTrue();
    }

    [Fact]
    public async Task EventRepository_UpdateAsync_ReturnsTrue()
    {
        // Arrange
        var eventToBeDelete = new Event()
        {
            Title = "Event 1"
        };
        var context = await GetDatabaseContext();
        var eventRepository = new EventRepository(context);

        // Assert
        var result = await eventRepository.UpdateAsync(eventToBeDelete);

        // Act
        result.Should().BeTrue();
    }
}

