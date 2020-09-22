CREATE TABLE [dbo].[Plataform](
    [Id] INT IDENTITY PRIMARY KEY,
    [Name] VARCHAR(30) NOT NULL
)

CREATE TABLE [dbo].[Category](
    [Id] INT IDENTITY PRIMARY KEY,
    [Name] VARCHAR(50) NOT NULL
)

CREATE TABLE [dbo].[Game](
    [Id] INT IDENTITY PRIMARY KEY,
    [Name] VARCHAR(100) NOT NULL,
    [ThumbnailLink] VARCHAR(1000) NOT NULL,
    [BackgroundLink] VARCHAR(1000) NOT NULL,
    [Price] INT NOT NULL,
    [Description] VARCHAR(500) NOT NULL,
    [Requirements] VARCHAR(500),
    [LaunchDate] DATE NOT NULL,
    [Developer] VARCHAR(100) NOT NULL,
    [Publisher] VARCHAR(100) NOT NULL,
	[Rating] VARCHAR(20) NOT NULL,
	[Active] BIT NOT NULL,
)


CREATE TABLE [dbo].[CategoryGame](
    [CategoryId] INT FOREIGN KEY REFERENCES [dbo].[Category]([Id]) NOT NULL,
    [GameId] INT FOREIGN KEY REFERENCES [dbo].[Game]([Id]) NOT NULL, 
	CONSTRAINT PK_CategoryGame PRIMARY KEY NONCLUSTERED ([CategoryId], [GameId])
)

CREATE TABLE [dbo].[PlataformGame](
    [PlataformId] INT FOREIGN KEY REFERENCES [dbo].[Plataform]([Id]) NOT NULL,
    [GameId] INT FOREIGN KEY REFERENCES [dbo].[Game]([Id]) NOT NULL, 
	CONSTRAINT PK_PlataformGame PRIMARY KEY NONCLUSTERED ([PlataformId], [GameId])
)

CREATE TABLE [dbo].[Media](
    [Id] INT IDENTITY PRIMARY KEY,
    [Type] VARCHAR(10),
    [Link] VARCHAR(1000) NOT NULL,
    [GameId] INT FOREIGN KEY REFERENCES Game(Id) NOT NULL
)

CREATE TABLE [dbo].[AccessLevel](
    [Id] INT IDENTITY PRIMARY KEY,
    [Description] VARCHAR(20)
)

CREATE TABLE [dbo].[Customer](
    [Id] INT IDENTITY PRIMARY KEY,   
	[ProviderId] VARCHAR(100) UNIQUE,
	[Name] VARCHAR(100) NOT NULL,
	[Email] VARCHAR(50) UNIQUE NULL,
	[AccessLevelId] INT FOREIGN KEY REFERENCES [dbo].[AccessLevel]([Id]) NOT NULL
)


CREATE TABLE [dbo].[CustomerGame](
    [CustomerId] INT FOREIGN KEY REFERENCES [dbo].[Customer]([Id]) NOT NULL,
    [GameId] INT FOREIGN KEY REFERENCES [dbo].[Game]([Id]) NOT NULL, 
	CONSTRAINT PK_CustomerGame PRIMARY KEY NONCLUSTERED ([CustomerId], [GameId])
)

CREATE TABLE [dbo].[CustomerFavorite](
    [CustomerId] INT FOREIGN KEY REFERENCES [dbo].[Customer]([Id]) NOT NULL,
    [GameId] INT FOREIGN KEY REFERENCES [dbo].[Game]([Id]) NOT NULL, 
	CONSTRAINT PK_CustomerFavorite PRIMARY KEY NONCLUSTERED ([CustomerId], [GameId])
)

CREATE TABLE [dbo].[PasswordRequest](
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [RequestDate] DATETIME NOT NULL, 
	[CustomerId] INT FOREIGN KEY REFERENCES [dbo].[Customer]([Id]) NOT NULL,
)

CREATE TABLE [dbo].[Invite](
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	[Email] VARCHAR(50) UNIQUE NOT NULL,
	[AccessLevelId] INT NOT NULL,
    [RequestDate] DATETIME NOT NULL, 
)

CREATE TABLE [dbo].[Order](
	[Id] INT PRIMARY KEY IDENTITY,
	[OrderDate] DATETIME NOT NULL,
	[GameKey] VARCHAR(300) NOT NULL,
	[Value] SMALLMONEY NOT NULL,
	[PlataformId] INT FOREIGN KEY REFERENCES [dbo].[Plataform]([Id]) NOT NULL,
	[GameId] INT FOREIGN KEY REFERENCES [dbo].[Game]([Id]) NOT NULL,
	[CustomerId] INT FOREIGN KEY REFERENCES [dbo].[Customer]([Id]) NOT NULL,
)




ALTER TABLE [Order] ADD FOREIGN KEY([PlataformId]) REFERENCES [dbo].[Plataform]([Id])