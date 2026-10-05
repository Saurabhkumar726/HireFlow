# ==========================================
# HireFlow API - .NET 10 Dockerfile
# ==========================================

# -----------------------------
# Build stage
# -----------------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Copy project file first for better Docker layer caching
COPY HireFlow.API.csproj ./

# Restore NuGet packages
RUN dotnet restore

# Copy the rest of the backend source code
COPY . .

# Publish the application
RUN dotnet publish HireFlow.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore


# -----------------------------
# Runtime stage
# -----------------------------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

# Copy published application
COPY --from=build /app/publish .

# Render expects the application to listen on a web port.
ENV ASPNETCORE_URLS=http://+:8080

# Document the container port
EXPOSE 8080

# Start HireFlow API
ENTRYPOINT ["dotnet", "HireFlow.API.dll"]