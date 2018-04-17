<!-- {
  users [] {
    id
    name
    email
    token (github accessToken)
    rooms: [id]
    ...
  }
  rooms [
    {
      name (unique)
      people: {{id, name}, {}}
      messages: {{sender, createdAt, text}, {}}
    }, {

    }
  ]
} -->

rooms -> people -> uid

users -> uid