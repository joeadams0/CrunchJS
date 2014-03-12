var Peer = {
    length: 2,
    name: "Peer",
    prototype: {
        _retrieveId: {
            length: 1,
            prototype: {}
        },
        _initialize: {
            length: 1,
            prototype: {}
        },
        _handleMessage: {
            length: 1,
            prototype: {}
        },
        _storeMessage: {
            length: 2,
            prototype: {}
        },
        _getMessages: {
            length: 1,
            prototype: {}
        },
        connect: {
            length: 2,
            prototype: {}
        },
        call: {
            length: 3,
            prototype: {}
        },
        _addConnection: {
            length: 2,
            prototype: {}
        },
        getConnection: {
            length: 2,
            prototype: {}
        },
        _delayedAbort: {
            length: 2,
            prototype: {}
        },
        _abort: {
            length: 2,
            prototype: {}
        },
        destroy: {
            prototype: {}
        },
        _cleanup: {
            prototype: {}
        },
        _cleanupPeer: {
            length: 1,
            prototype: {}
        },
        disconnect: {
            prototype: {}
        }
    },
    super_: {
        name: "EventEmitter",
        prototype: {
            addListener: {
                length: 4,
                prototype: {}
            },
            on: {
                length: 4,
                prototype: {}
            },
            once: {
                length: 3,
                prototype: {}
            },
            removeListener: {
                length: 3,
                prototype: {}
            },
            off: {
                length: 3,
                prototype: {}
            },
            removeAllListeners: {
                length: 1,
                prototype: {}
            },
            listeners: {
                length: 1,
                prototype: {}
            },
            emit: {
                length: 1,
                prototype: {}
            }
        }
    }
};