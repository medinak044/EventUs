using API;
using API.Configurations;
using API.Data;
using API.Extensions;
using API.Interfaces;
using API.Models;
using API.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddTransient<Seed>(); // dotnet run seeddata
builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles); // Many to many relationships will go into the entity and get stuck in a loop
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies()); // AutoMapper 
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>(); // Unit of work, handles db requests
builder.Services.AddEndpointsApiExplorer(); // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});

#region Jwt Token Authentification
builder.Services.Configure<AppSettings_Jwt>(builder.Configuration.GetSection(key: "JwtConfig"));

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("JwtConfig:Secret").Value));
var tokenValidationParams = new TokenValidationParameters()
{
    ValidateIssuerSigningKey = true,
    IssuerSigningKey = key,
    ValidateIssuer = false, // Set to false for development: running the app locally on device might cause the generated https ssl credentials to become invalidated, causing an issue
    //ValidIssuer = ,
    ValidateAudience = false, // for dev
    RequireExpirationTime = false, // for dev -- needs to be updated when refresh token is added
    ValidateLifetime = true, // Calculates how long the token will be valid
};

builder.Services.AddSingleton(tokenValidationParams);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(jwt =>
    {
        jwt.SaveToken = true;
        jwt.TokenValidationParameters = tokenValidationParams;
    });
#endregion

// Database connection
//builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddDbContext<DataContext>(options =>
{
    //options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnectionPostgreSQL"));
    options.UseSqlServer(builder.Configuration.GetConnectionString("ProdConnection")); // Prod
    //options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectionSQLServer"));
    //options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectionSQLServer2"));
    //options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnectionSQLite"));
});

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

#region Seed data
if (args.Length == 1 && args[0].ToLower() == "seeddata")
    SeedData(app);

void SeedData(IHost app)
{
    var scopedFactory = app.Services.GetService<IServiceScopeFactory>();

    using (var scope = scopedFactory.CreateScope())
    {
        var service = scope.ServiceProvider.GetService<Seed>();
        service.SeedDataContext();
    }
}
#endregion

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(myAllowSpecificOrigins);

app.UseAuthorization();

//#region Tell API server to use static files (Angular frontend)
//app.UseDefaultFiles(); // If index.html exists, use it
//app.UseStaticFiles();
//#endregion

app.MapControllers();

app.Run();
