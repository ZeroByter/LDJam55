export class ReplaySnapshot {
  /**
   * @param {number} time 
   * @param {ReplayPlayerSnapshot} playerSnapshots 
   * @param {ReplayNonPlayerSnapshot} nonPlayerSnapshots 
   */
  constructor(time, playerSnapshots, nonPlayerSnapshots) {
    this.time = time

    this.playerSnapshots = playerSnapshots
    this.nonPlayerSnapshots = nonPlayerSnapshots
  }
}

export class ReplayPlayerSnapshot {
  constructor(id, x, y, holding) {
    this.id = id
    this.x = x
    this.y = y
    this.holding = holding
  }
}

export class ReplayNonPlayerSnapshot {
  constructor(id, x, y, sprite, extraData) {
    this.id = id
    this.x = x
    this.y = y
    this.sprite = sprite
    this.extraData = extraData
  }
}

export class ReplaySystem {
  constructor() {
    this.snapshots = []
    this.playbackTimeStart = 0
  }

  getSnapshots(time) {
    let current = null
    let next = null

    if (this.snapshots.length == 0) {
      return;
    }

    for (let i = 0; i < this.snapshots.length; i++) {
      const snapshot = this.snapshots[i]

      if (current == null || snapshot.time > current.time && snapshot.time <= time) {
        current = snapshot

        if (i + 1 < this.snapshots.length) {
          next = this.snapshots[i + 1]
        } else {
          next = null
        }
      }
    }

    return [current, next]
  }

  getPlaybackTime(time) {
    return time - this.playbackTimeStart
  }

  getLastSnapshot() {
    return this.snapshots[this.snapshots.length - 1]
  }
}
