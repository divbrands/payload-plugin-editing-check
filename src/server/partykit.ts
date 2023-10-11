import type * as Party from 'partykit/server'

export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) {}

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
        id: ${conn.id}
        room: ${this.party.id}
        url: ${new URL(ctx.request.url).pathname}`,
    )

    const connections: string[] = []
    for (const connection of this.party.getConnections()) {
      if (connection.id !== conn.id) {
        connections.push(connection.id)
      }
    }

    // No one is editing, so this connection can edit
    if (connections.length === 0) {
      // Only the new connection gets this one
      conn.send(conn.id)
      await this.party.storage.put('editingId', conn.id)
    } else {
      // Someone else is editing, so this connection can't edit (we send the active connection)
      const editingId = (await this.party.storage.get<string>('editingId')) || ''
      conn.send(editingId)
    }
  }

  async onClose(conn: Party.Connection) {
    const editingId = await this.party.storage.get<string>('editingId')
    if (editingId === conn.id) {
      this.party.storage.delete('editingId')
    }

    // Get connections
    const connections: string[] = []
    for (const connection of this.party.getConnections()) {
      if (connection.id !== conn.id) {
        connections.push(connection.id)
      }
    }

    // If whoever was editing leaves, define who can edit and broadcast it
    if (connections.length > 0) {
      await this.party.storage.put('editingId', connections[0])
      this.party.broadcast(connections[0])
    }
  }
}

Server satisfies Party.Worker
