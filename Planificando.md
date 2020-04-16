# Guardar precios nabos por usuario 2 al dia

Valor de msg cuando invocan un comando


```
{
    "message_id":28,
    "from": {
        "id":46086087,
        "is_bot":false,
        "first_name":"Annilou",
        "username":"Valkiriann",
        "language_code":"es"
    },
    "chat": {
        "id":46086087,
        "first_name":"Annilou",
        "username":"Valkiriann",
        "type":"private"
    },
    "date":1587062823,
    "text":"/hola bla bla bla",
    "entities":[{"offset":0,"length":5,"type":"bot_command"}]
}
```
- id autoincremental
- nombre bonito         msg.from.first_name
- usuario               msg.from.username  
- fecha (solo el dia)   msg.date
- morning               msg.text - conditional y limpieza
- evening               msg.text - conditional y limpieza
- crud


fecha : {
    señor: {
        bonito
        mañana
        tarde
    }
    señor
}