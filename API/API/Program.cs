using API.Data;
using API.Interfaces;
using API.Models;
using API.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies()); // AutoMapper 
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>(); // Unit of work, handles db requests
builder.Services.AddEndpointsApiExplorer(); // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSwaggerGen();

// Database connection
builder.Services.AddDbContext<DataContext>(options =>
{
    //options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

//TASK: Separate cors configuration logic into separate file
var myAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(
    options =>
    {
        options.AddPolicy(
            name: myAllowSpecificOrigins,
            policy =>
            {
                policy.WithOrigins("http://localhost:4200") // Include client app's origin
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
    }
);

builder.Services.AddIdentity<AppUser, IdentityRole>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddEntityFrameworkStores<DataContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(myAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
