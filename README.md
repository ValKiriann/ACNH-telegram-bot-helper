# ACNH-telegram-bot-helper

<img align="center" src="http://www.thecourieronline.co.uk/wp-content/uploads/2017/11/Tom-Nook-Courier.jpg" alt="fondo de pantalla tom nook"> 

**EN** ![translation-icon](https://github.com/ValKiriann/ACNH-telegram-bot-helper/wiki/images/extensible-markup-language-blue.png) This README was writen in two languages. You can read it in English or in Spanish. I dont like the country flag distinctive to represent languages. Instead, a combination of the universal icon of translation with a color with the two digit ISO code would represent the language. English would always be represented here with pastel blue.

**ES** ![icono-traducción](https://github.com/ValKiriann/ACNH-telegram-bot-helper/wiki/images/extensible-markup-language-purple.png) Este README se ha escrito en dos idiomas. Puedes leerlo en Inglés y en Español. No me gusta usar banderas de país para distinguir idiomas así que voy a usar el icono universal de traductor con un color y el código ISO de dos dígitos para representar los idiomas. El Español siempre va a ser representado por un color morado pastel.

<img align="center" width="300" src="https://github.com/ValKiriann/ACNH-telegram-bot-helper/wiki/images/example.gif">

<a name="back"></a>   

| Table of Contents | Tabla de Contenidos |
| ------------------- | --------------------- |
| [Description](#description) | [Descripción](#descripcion) |
| [Command List](#command) | [Lista de Comandos](#comandos) |
| [Pre-requirements](#pre-requirements) | [Pre-requisitos](#comandos) |
| [Installation](#installation) | [Instalación](#instalacion) |

## Description | Descripción
<a name="Description"></a>   
**EN** ![translation-icon](https://github.com/ValKiriann/ACNH-telegram-bot-helper/wiki/images/extensible-markup-language-blue.png) ACNH Telegram Bot Helper is the bot you are looking for if you need help to automate your Animal Crossing New Horizons group channel.   

MVP: Currently - with this bot you can manage the selling/buying prices of all your group members and display the list of prices whenever you need it   

_[⬆️Back to Content Table](#back)_  

<a name="Descripcion"></a>   
**ES** ![icono-traducción](https://github.com/ValKiriann/ACNH-telegram-bot-helper/wiki/images/extensible-markup-language-purple.png) ACNH Telegram Bot Helper es el bot que estás buscando si necesitas ayuda para automatizar tu grupo de Animal Crossing New Horizons en Telegram. 

El Bot permite registrar usuarios que se encuentren dentro de un grupo de Telegram al que pertenezca (para filtrar quién lo usa) y almacena datos en el tiempo de compra y venta de los usuarios.

_[⬆️Volver a la Tabla de Contenidos](#back)_

## Command List: | Lista de comandos y acciones:
<a name="command"></a>   
**EN** ![translation-icon](https://github.com/ValKiriann/ACNH-telegram-bot-helper/wiki/images/extensible-markup-language-blue.png)   
- Add selling price (**/venta <number>** by default): Add a selling price for the current day and turn
- Selling Price List (**/dondeVender** by default): Shows a list with all the selling prices for the current day and turn
- Add purchase price (**/compra <number>** by default): Add a purchase price for Daisy Mae in your island for the current day 
- Purchase Price List (**/dondeComprar** by default): Shows a list with all the purchase prices for the current morning
- Start the bot (**/start** by default): Starts the bot and shows how to register  
- Help (**help** by default): Show the command list to a registered user
- Register a user (**/registro** by default): Registers a new user to be able to use the commands. The user must be in a telegram group where the bot also is a member. The bot is designed to be able to filter who uses it.  
> Disclaimer: The bot collects sensible telegram user information, it is important to notify the people that are going to use the bot. In order to work properly, the bot stores the ID of the user in telegram and uses it as a unique identifier in his database. It also stores the user id of Telegram in case that the user has one and the public name that the user shows in Telegram.  
  
_[⬆️Back to Content Table](#back)_  
  
<a name="comandos"></a>   
**ES** ![icono-traducción](https://github.com/ValKiriann/ACNH-telegram-bot-helper/wiki/images/extensible-markup-language-purple.png)  
- Añadir precio de venta (Por defecto **/venta <number>**): Añade un precio de venta para el día actual y el turno actual (controla por las horas si estás en turno de mañana o de tarde)  
- Lista los precios para hoy (Por defecto **/dondeVender**): Muestra una lista con todos los precios de venta recogidos durante le día para el turno actual  
- Añadir precio de compra (Por defecto **/compra <number>**): Añade un precio de compra para Daisy Mae en tu isla para el día actual  
- Lista los precios de compra para hoy (Por defecto **/dondeComprar): Muestra una lista con todos los precios de compra recogidos durante la mañana  
- Iniciar el bot (**/start**): Inicia el bot e indica como registrarse  
- Ayuda (por defecto **/help**): Muetsra una lista de comandos  
- Registrar un usuario (Por defecto **/registro**): Registra a un usuario para poder usar los comandos del bot. El usuario tiene que encontrarse en un grupo al que también pertenezca el bot. El bot está diseñado para poder filtrar quien hace uso del bot
> Disclaimer: El bot recaba información sensible de sus usuarios, es importante notificar a las personas que vayan a hacer uso de él. Para poder funcionar el bot guarda el ID de telegram del usuario y lo utiliza como Identificador único en su base de datos. También almacena el nombre de usuario en caso de tener uno público y su nombre para mostrar en telegram.  

_[⬆️Volver a la Tabla de Contenidos](#back)_  

## Pre-requirements | Pre-requisitos
<a name="pre-requirements"></a>   
**EN** ![translation-icon](https://github.com/ValKiriann/ACNH-telegram-bot-helper/wiki/images/extensible-markup-language-blue.png)   
- An Amazon web services account and a pair of credential keys. The bot requires DynamoDB as database to store the information collected and to display it.  
- DynamoDB. The free tier is enough to execute the bot services so you would not generate a cost for using this service. (Check the pricing table in case that your are going to use it with a huge number of users). The code is made so that 2 tables of dynamoDB are created in the region of your election. The tables must follow this minimumn structure, but it is possible to modify the names of the table if you want to:  

| first table: prices | second table: users |
| ------------------- | ------------------- |
| date - primary key - string | chat_id - primary key - number |
| chat_id - sort key - number |

- A server to deploy the bot. It could be your own local pc but the life of the robot would depend on being executed inside your machine. You can user a paid server but I did not want to spend any money on this project so I deployed my copy of the bot in a raspberry pi in my home as of the moment of this writing.

_[⬆️Back to Content Table](#back)_  

<a name="pre-requisitos"></a>   
**ES** ![icono-traducción](https://github.com/ValKiriann/ACNH-telegram-bot-helper/wiki/images/extensible-markup-language-purple.png)    
- Una cuenta de Amazon Web Services y una pareja de claves para acceder a los servicios de AWS. Usaremos DynamoDB como base de datos NoSQL y para ello hay que conectarse por credenciales.

- DynamoDB. Con la capa gratuita permanente de este servicio tenemos suficiente por lo que no generarás un gasto por usar este servicio. (Consulta la tabla de precios en caso de que vayas a usar el bot con una ingente cantidad de usuarios). La programación está hecha para que conectes dos tablas de dynamoDB en la región de tu elección. Las tablas deben seguir esta estructura mínima, es posible modificar el nombre de las tablas pero no de los campos primarios:  

| tabla 1: prices | tabla 2: users |
| --------------- | ---------------|
| date - primary key - string | chat_id - primary key - number |
| chat_id - sort key - number |


- Un server en el que desplegar el bot. Puede ser tu propio ordenador pero la vida del robot dependerá de que se esté ejecutando en él. Puede también usar un servidor de pago aunque para mí no era una opción invertir dinero en este proyecto asi que yo he optado por desplegarlo de momento en una raspberry.

_[⬆️Volver a la Tabla de Contenidos](#back)_  

## Installation | Instalación
<a name="installation"></a>   
**EN** ![translation-icon](https://github.com/ValKiriann/ACNH-telegram-bot-helper/wiki/images/extensible-markup-language-blue.png)   
1. Create a new bot for Telegram [(Link)](https://core.telegram.org/bots#6-botfather)  
2. Clone this repository  
3. install all the dependencies  
```
npm i
```
4. Rename .env-example to .env and fill the variables:
```
TELEGRAM_BOT_TOKEN= ---> Your bots token   
AWS_ACCESS_KEY_ID= --> Your aws access key id  
AWS_SECRET_ACCESS_KEY= --> Your aws secret access key   
TIMEZONE= --> This variable helps to adjust the timezone between the server and your country. You should put here the number of the hour difference to get a proper calculation of the turnip sell turns. (12pm is the switch between morning and evening). You can add or subtract with a - sign before the number   
PRICES_TABLE= --> Name of your prices table   
USERS_TABLE= --> Name of your users table    
DYNAMODB_URL= --> The url of the Dynamodb endpoint, if you are in eu-west region it would be https://dynamodb.eu-west-1.amazonaws.com  
GROUP_ID= --> The Group id of the telegram group chat where the bot and your users are going to be. I added a console.log to the register command so you can execute it in the group and it would return you the group ID in the terminal of the app execution. You should see something like this: (in spanish)
```
![terminal-console.log-group-id](https://github.com/ValKiriann/ACNH-telegram-bot-helper/wiki/images/terminal-find-groupId.png)  
5. Start the bot launching the NodeJs app
```
node index.js
```
If everything is OK you can start talking with your bot.   
The users need to register chatting with the bot in private. Once a user is registered, the commands can be launched in private or in the group, whoever the bot would always reply in private, thats why the user needs to interact at least one time with the bot in private, otherwise the bot wont be able to initiate a chat with the user.  

_[⬆️Back to Content Table](#back)_  

<a name="instalacion"></a>   
**ES** ![icono-traducción](https://github.com/ValKiriann/ACNH-telegram-bot-helper/wiki/images/extensible-markup-language-purple.png)    

1. Crea un nuevo Bot para telegram [(Link)](https://core.telegram.org/bots#6-botfather)
2. Clonar el repositorio
3. Instalación de dependencias
```
npm i
```
4. Renombra el archivo .env-example a .env y llénalo con tus valores: 
```
TELEGRAM_BOT_TOKEN= ---> La token de tu bot de telegram  
AWS_ACCESS_KEY_ID= --> Access key id de aws  
AWS_SECRET_ACCESS_KEY= --> Secret access Key de aws  
TIMEZONE= --> Esta variable ayuda a corregir el uso horario del servidor donde despliegues la app con tu hora local para poder hacer la distinción de turnos de venta. (hasta las 12 am el de mañana y posteriormente el de la tarde) Pon aquí el número que haya que sumar (o con un - delante para restar) a la hora local del servidor y así poder tener una sincronización con tu hora local  
PRICES_TABLE= --> Nombre de la tabla prices  
USERS_TABLE= --> Nombre de la tabla users  
DYNAMODB_URL= --> url de dynamodb, si tienes las tablas en irlanda es https://dynamodb.eu-west-1.amazonaws.com   
GROUP_ID= --> El ID del grupo de telegram en el que va a estar tu bot y tus usuarios. He añadido un console.log al comando de /registro para que si lo ejecutas desde el grupo en la terminal donde lances el bot aparezca este mensaje:
```
![terminal-console.log-group-id](https://github.com/ValKiriann/ACNH-telegram-bot-helper/wiki/images/terminal-find-groupId.png)  
5. Enciende el bot lanzando la app en NodeJs
```
node index.js
```
Si todo ha ido bien ya podrías empezar a hablar con tu bot.   
Los usuarios se registran hablando por privado con el bot. Una vez registrado, se pueden lanzar los comandos por privado o por el grupo, pero el bot responde por privado, es por eso que hace falta que cada usuario interactúe al menos una vez con el bot por privado, o de lo contrario no podría abrir una conversación con el usuario.
***

_[⬆️Volver a la Tabla de Contenidos](#back)_  

_Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>_
