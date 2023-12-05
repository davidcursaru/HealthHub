using NutritionManager.Extensions;
using NutritionManager.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});
builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddHttpClient();

//builder.Services.AddEndpointsApiExplorer();


var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

//if (builder.Environment.IsDevelopment())
//{
//    app.UseDeveloperExceptionPage();
//}

//Add CORS
app.UseHttpsRedirection();
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
