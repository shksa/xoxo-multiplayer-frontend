## Typescript notes
# Object type
- **`object`** is a type that represents the **non-primitive type**, i.e. any thing that is not **`number, string, boolean, symbol, null, or undefined`**.
- ```typescript
    declare function create(o: object | null): void;

    create({ prop: 0 }); // OK
    create(null); // OK

    create(42); // Error
    create("string"); // Error
    create(false); // Error
    create(undefined); // Error
    ```

## ICE Candidate
- The RTCIceCandidate interface—part of the WebRTC API represents a candidate **`Internet Connectivity Establishment (ICE) configuration`** which may be used to establish an RTCPeerConnection.
- An ICE candidate describes the protocols and routing needed for WebRTC to be able to communicate with a remote device. - When starting a WebRTC peer connection, typically a number of candidates are proposed by each end of the connection, until they mutually agree upon one which describes the connection they decide will be best.
- WebRTC then uses that candidate's details to initiate the connection.

## Exchanging ICE candidates
- After exchanging an offer and answer, the two peers start exchanging ICE candidates to negotiate the actual connection between them. 
- Every ICE candidate describes a method that the sending peer is able to use to communicate.
- Each peer sends candidates in the order they're discovered, and keeps sending candidates until it runs out of suggestions, even if media has already started streaming.
- Once the two peers agree upon a mutually-compatible candidate, that candidate's SDP is used by each peer to construct and open a connection, through which media then begins to flow. 
- If they later agree on a better (usually higher-performance) candidate, the stream may change formats as needed.