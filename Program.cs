var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel to listen on port 7700
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(7700);
});

var app = builder.Build();

// Serve default files and static files from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// Optional: Map a simple health endpoint
app.MapGet("/health", () => Results.Text("OK"));
// If no other middleware handled the request, let the server run normally.
// Log the startup message and run the app (this call blocks and starts the web host).
Console.WriteLine("Starting web app on http://localhost:7700");

app.Run(); h
