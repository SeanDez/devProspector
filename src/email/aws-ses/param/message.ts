export default interface Message {
  Body: {
    Html: {
      Charset: string
      Data: string
    }
    Text: {
      Charset: string
      Data: string
    }
  }
  Subject: {
    Charset: string
    Data: string
  }
}
