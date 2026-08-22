# Project Name: OffPay
(although the folder and the repo is named as bondpay, our project name is OffPay)

===================================================================================

### what is OffPay?
off pay is a semi offgrid payment system which lets users do transactions without the availability of internet.

===================================================================================

### what is offpay solving?
specially in case of nepal, mobile data provided by network carriers is expensive. we do frequent ride sharing and transaction where there is no internet and turning on mobile data every time is really expensive and during the tranactions, currently when we go to a shop to buy something, at first we have to scan the QR code for the WiFi, connect to the WiFi and then only we can open our banking app and pay the amount which is preety annoying and a hastle. what offpay solves is when we are going out from our home, what we can do is issue some of our online wallet's balance as offline usable balance, the user sends a request to the server saying they need `x` amount of money to be made as offline payable, the server then breaks down `x` into multiple tokens, signs each token individually usning ed25519 cryptography using it's private key for encryption and then sends back those validated tokens to the user for them to spend. the user can then use those tokens to spend the money, they can exchange the ownership of the bonds to one person to another and pay without the necessity of the internet. at site where internet is not available, the client verifies the transaction by using the public key of the server and validates but the server doesnt trust only the client side verification and as soon as either the sender or the reciever goes online, it sends those pending transactions to the server to verify its validity and upon confirmation, the transaction completes and the money gets pushed to their online balance itself. a bond can only be transfered once from A to B, if A generates some `bond`( which is the term for offline balance ), he can give it to B by transfering ownership without the availability of internet but that bond recieved by B is not spendable and can only be seen as a proof of acceptance and only can be seen, for spending that recieved amount, they must come online and sync to the server and then accordingly expire that bond and push that amount to the online balance to make it spendable.

===================================================================================

### what is a bond?
bond is a token signed by the server which is similart to physical notes issued by the banks. they are unique and are cryptographically signed. they expire after a certain time and once a bond expires, the amount associated to the bond is issued to the bond owner. the crutial details like the amount, issued by, issue date, expiry date, etc will be signed by the server and the details like the owner ID, the owner details will be signed by the owner's private key. every bond also carries a sequence number that goes up by one on every transfer, this is what lets the server later on tell apart a legit chain of transfers from someone trying to spend the same state of the bond twice, more on this below in the double spend part.

===================================================================================

### what is the workflow?
so what happens first is, as our project offpay is something which is yet just a concept and not a real life product, the user can load online balance (basically when the user is online, they can just type a number and recharge their account) but later when this will be a real product we will collab with banks to import currency from other accounts into our system. once a user has some online balance associated to their account, they can issue bonds when they are online. they will click the generate bonds button and type in the amount of money they want and then they will click request bond. this will then send the request to the server which will break down that amount by breaking it down into multiple portions like bank notes, something like, if 1000rs is requested, it will break it down into 1 bond of 500rs, 3 notes of 100rs, 3 notes of 50rs, 1 note of 20rs, 2 note of 10rs, 2 notes of 5rs. and then it will sign each and every bond and generate a security code and then sign using the server's private key using the ed25519 encryption technology. that bond string and details is sent to the user's device and then it will be saved in the local SQLite database in the user's device itself. and then the user will be able to go offline and start spending the money.

quick note on the account itself, the server never keeps a copy of the user's private key, only the public key. the private key gets generated on the phone itself the first time the app is set up and it stays there, this way even if someone got into our server database they still cant sign anything on behalf of a user, they would need the actual phone.

===================================================================================

### how does the transfer happen without internet?
it works on the basis of QR codes. if Alice is trying to send money to Bob, here Alice is the sender and Bob is the reciever. let us suppose Alice has bond of rs 250 where the tokens are rs100+rs100+rs50. then if Bob needs to have 250rs this is the workflow:
1) bob opens the OffPay App
2) bob clicks recieve money
3) bob enters how much he needs to recieve
4) bob clicks generate QR. a QR code will be displayed in the Bob's screen.
5) that QR code in the Bob's screen will have the following details:
    1) Bob's UUID
    2) Bob's name
    3) Bob's phone number
    4) Bob's public key for ed25519 decryption
    5) Amount of money to recieve
6) now Alice who is the sender will scan that QR code and get all those details
7) Alice's App will now check the amount of money requested and then show how much is Bob requesting along with his name and phone number and also it will show how much spendable offline bond does alice have and is it possible to do the transaction as per the available tokens, it will check if we have the exact change/combination of tokens to fulfill the demand of Bob, if not then the request will be canceled. (we know exact-change-only is a limitation, being able to break a bond into smaller change offline is something we are leaving for later, not doing it in this build)
8) once alice clicks confirm, alice's app will start verifying the bonds by decrypting the bond string signed by the server and verifying the authenticity of the bond and if passed, it will then change the owner of the bond to the UUID of Bob and bump up the bond's sequence number by one, and also will change its type from `spendable` to `sent but yet to sync` and wont let alice spend that bond again. alice will sign that packet by using her private key and then generate a transaction packet containing the following data:
    1) Sender UUID
    2) reciever UUID
    3) timestamp
    4) a random nonce for this transaction, so the same packet cant just be replayed later to trigger the payment again
    5) bonds: bonds signed by alice's private key which also contains the server signed core bond details and the new sequence number
    6) transaction ID
9) Alice will encrypt that packet by using her private key and then will attach her public key along with the payload and then generate QR code of the packet, as the transaction packet is really really big and is not possible to send that packet in a single QR code, it will break down that generated QR code/ that packet into multiple chunks depending upon the size and make decent sized proper QR codes and then will start a slideshow of QR codes which keep on changing. every QR code in the slideshow will contatin the metadata about how many QR are generated in total and which index is that individual QR so that the scanner can identify properly.
10) in bob's device, once he has shown the initial QR code containing his credentials, he will have an option to do scan receipt which will allow Bob to scan the slideshow of the QR codes. which will show in Bob's screen that there are currently x QR codes to be scanned and we have scanned y QR codes so that bob will know when to stop. and then once that scanning is completed, bob starts verification of payment.
11) Bob's App will now decrypt the assembled packet of transaction using the public key of Alice and then will proceed to verify each Bond's information based on the data and the server signed token, and also checks the nonce hasnt been seen before. if everything matches and passes, the payment is marked completed in local level and will be stored in his local database as `unspendable(pending)` bond which will be shown in his device but will not be spendable. he will then have to go online to sync.

===================================================================================

### what is the tech stack and how will a user access it?
Our production architecture is designed to be secure, fast, and easy to build:
1. **Client App**: **React Native (Expo)**
   - Fast continuous camera scanning for QR codes (`expo-camera` / barcode scanner).
   - Local storage with **SQLite** for offline bond caches, transaction history, and contacts.
   - **Hardware-Backed Key Storage (`expo-secure-store`)**: The user's Ed25519 private key is stored securely in the device's **Android Keystore / iOS Keychain**, never in plain SQLite.
   - Client-side cryptography using audited Ed25519 libraries (`@noble/curves` / `@noble/ed25519`).
2. **Backend**: **Node.js (TypeScript with Fastify / Express)**
   - High-performance, lightweight API server running on the VPS.
   - Native `node:crypto` for lightning-fast Ed25519 server-side verification and bond signing.
   - Shared TypeScript types between client and backend to prevent schema discrepancies.
3. **Database**: **MySQL (InnoDB Engine)**
   - Hosted on the VPS with phpMyAdmin access.
   - Strict ACID transactions and row-level locking (`SELECT ... FOR UPDATE`) during sync operations to eliminate race conditions.

===================================================================================

### core security & implementation specifications

1. **Hardware-Backed Private Key Storage**:
   - The user's Ed25519 private key is generated locally on first app launch and stored directly in the device's secure hardware module (Android Keystore / iOS Keychain via `expo-secure-store`).
   - The private key is never saved as plaintext in SQLite and never transmitted to the server or over QR.

2. **Canonical JSON Serialization before Signing**:
   - When hashing or signing JSON payloads (bonds, transactions, transfer packets), key ordering differences (e.g. `{"amount":100,"id":1}` vs `{"id":1,"amount":100}`) could break signature verification.
   - All payloads are strictly serialized using **Canonical JSON (RFC 8785 / `canonicalize` / `fast-json-stable-stringify`)** before computing Ed25519 signatures on both client and server.

3. **Database Concurrency Locking on Sync**:
   - When processing a sync request, the Node.js backend wraps the verification and state updates in an atomic database transaction with row-level locks:
     ```sql
     START TRANSACTION;
     SELECT * FROM bonds WHERE id = ? FOR UPDATE;
     -- Verify sequence, nonce, and claim eligibility
     -- Insert into bond_transfer_log, update bond owner/status, credit online_balance
     COMMIT;
     ```
   - This ensures simultaneous sync requests from Alice and Bob (or replay attempts) are executed sequentially, guaranteeing zero race conditions.

4. **Replay & Double-Spending Protection**:
   - Every transaction contains a unique cryptographic `nonce` that both the client app and backend record to prevent replay attacks.
   - Every bond has a monotonic `sequence` number. Whichever valid transfer claim reaches the server first is accepted; any conflicting attempt is rejected and retained in `bond_transfer_log` as immutable cryptographic proof.

===================================================================================

### situation handling

Q. Alice sends a bond and Bob never syncs?
=> either one of alice or bob can sync and the server will accept their sync request and do the ammendment to the balance of their online balance and as the once transaction made balance is not spendable in any of their side, the money is safe from double spending. the transfer log entry gets recorded either way as soon as whichever one of them actually gets internet.

Q. Alice goes online before Bob?
=> the transaction is synced and the increment occurs in the server, this gets recorded as the accepted transfer for that bond's sequence number, so when bob eventually syncs too it just matches up with what the server already has, no conflict.

Q. The bond expires while Bob is holding it?
=> even if the bond expires, we have the proof that the bond is now owned by someone and the associated money will be sent to the owner rather than the issuer. a server can't automatically give back the money to the bond issuer if the bond expires, the bond money returning only happens once that bond's owner is verified via a sync by any one of either the sender or the reciever. and just to be clear, whether a bond is actually expired or not is always decided using the server's own clock at the time of sync, not whatever date the phone happens to show, the phone's copy of the expiry date is just there to give the user a heads up in the UI.

Q. Alice's transaction syncs but Bob's doesn't?
=> once one of them syncs, the transaction is already marked synced and its not necessary for both to sync.

Q. Both Alice and Bob sync simultaneously?
=> the one who does it first will be recorded, and this is enforced properly now because of the sequence number, the server only accepts the first claim that comes in for a given bond id and sequence number, the second one automatically gets rejected and logged instead of silently overwriting anything.

Q. A transaction fails server validation?
=> in such case, the system will have an option to claim the money by contacting the admin, the admin will then check all the logs as we have all the logs about what happened to the transaction, including any rejected/conflicting transfer attempts from the bond_transfer_log, and an admin will manually do the needful.