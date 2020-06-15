'use strict';

const {Contract} = require('fabric-contract-api');

class UserContract extends Contract {
	
	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.property-registration.user-regnet');
	}
	
	/* ****** All custom functions are defined below ***** */
	
	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('Regnet User Smart Contract Instantiated');
	}
	
	/**
	 * Create a Request for new user on the network
	 * @param ctx - The transaction context object
	 * @param name - Name of the user
	 * @param email - Email ID of the user
     * @param phoneNumber - Phone Number of the user
     * @param aadharNumber - Aadhar Number of the user
	 * @returns
	 */
	async requestNewUser(ctx, name, email, phoneNumber, aadharNumber) {
		// Create a composite key for the new user
		const userKey = ctx.stub.createCompositeKey('org.property-registration.user-regnet.user', [name, aadharNumber]);
		
		// Create a Request object to be stored in blockchain
		let newRequestObject = {
			name: name,
            email: email,
            phoneNumber: phoneNumber,
            aadharNumber: aadharNumber,
			createdAt: new Date(),
		};
		
		// Convert the JSON object to a buffer and send it to blockchain for storage
		let dataBuffer = Buffer.from(JSON.stringify(newRequestObject));
        await ctx.stub.putState(userKey, dataBuffer);
        
		// Return value of new Request Object created to user
		return newRequestObject;
	}
    
    /**
	 * To Recharge User's Account with 'upgradCoins'
	 * @param ctx - The transaction context object
	 * @param name - Name of the user
     * @param aadharNumber - Aadhar Number of the user
     * @param bankTransactionID - Bank Transaction ID of the user
	 * @returns
	 */
	async rechargeAccount(ctx, name, aadharNumber, bankTransactionID) {
        let bankTransactionIDList = ["upg100", "upg500", "upg1000"];
        //  Validating the Transaction ID
        if(bankTransactionIDList.includes(bankTransactionID)) {
            // Generate composite key for the user
            const userKey = ctx.stub.createCompositeKey('org.property-registration.user-regnet.user', [name, aadharNumber]);

            // Return details of user from blockchain
            let userBuffer = await ctx.stub
                            .getState(userKey)
                            .catch(err => console.log(err));

            let userObject = JSON.parse(userBuffer.toString());

            if(bankTransactionID === "upg100") {
                userObject.upgradCoins = 100;
            } else if(bankTransactionID === "upg500") {
                userObject.upgradCoins = 500;
            } else if(bankTransactionID === "upg1000"){
                userObject.upgradCoins = 1000;
            }

            // Convert the JSON object to a buffer and send it to blockchain for storage
            let dataBuffer = Buffer.from(JSON.stringify(userObject));
            await ctx.stub.putState(userKey, dataBuffer);

        } else {
            throw new Error("Invalid Bank Transaction ID");
        }
    }

    /**
	 * To View User's Account
	 * @param ctx - The transaction context object
	 * @param name - Name of the user
     * @param aadharNumber - Aadhar Number of the user
     * @returns
	 */
	async viewUser(ctx, name, aadharNumber) {

        // Generate composite key for the user
        const userKey = ctx.stub.createCompositeKey('org.property-registration.user-regnet.user', [name, aadharNumber]);

        // Return details of user from blockchain
        let userBuffer = await ctx.stub
                        .getState(userKey)
                        .catch(err => console.log(err));

        let userObject = JSON.parse(userBuffer.toString());

        return userObject;
    }

    /**
	 * Create a Request for Property Registration on the network
	 * @param ctx - The transaction context object
	 * @param propertyID - Property ID of the Property
	 * @param price - price of the Property
     * @param status - status of the Property
     * @param name - Name of the Owner
     * @param aadharNumber - Aadhar Number of the Owner
	 * @returns
	 */
	async propertyRegistrationRequest(ctx, propertyID, price, status, name, aadharNumber) {
		// Create a composite key for the user
		const userKey = ctx.stub.createCompositeKey('org.property-registration.user-regnet.user', [name, aadharNumber]);
        
        // Return details of user from blockchain
        let userBuffer = await ctx.stub
                        .getState(userKey)
                        .catch(err => console.log(err));

        if(userBuffer !== null) {   //  To check whether the user is already registered on the Network or not.
            // Create a composite key for the Property
            const propertyKey = ctx.stub.createCompositeKey('org.property-registration.user-regnet.property', [propertyID]);

            // Create a Request object to be stored in blockchain
            let newPropertyRequestObject = {
                propertyID: propertyID,
                owner: userKey,
                price: price,
                status: status,
                createdAt: new Date(),
            };
            
            // Convert the JSON object to a buffer and send it to blockchain for storage
            let dataBuffer = Buffer.from(JSON.stringify(newPropertyRequestObject));
            await ctx.stub.putState(propertyKey, dataBuffer);
            
            // Return value of new Request Object created to user
            return newPropertyRequestObject;
        } else {
            throw new Error("Owner not Registered");
        }
    }
    
    /**
	 * To View Property's Details
	 * @param ctx - The transaction context object
	 * @param propertyID - Property ID of the Property
     * @returns
	 */
	async viewProperty(ctx, propertyID) {

        // Create a composite key for the Property
        const propertyKey = ctx.stub.createCompositeKey('org.property-registration.user-regnet.property', [propertyID]);

        // Return details of Property from blockchain
        let propertyBuffer = await ctx.stub
                                .getState(propertyKey)
                                .catch(err => console.log(err));

        let propertyObject = JSON.parse(propertyBuffer.toString());

        return propertyObject;
    }


    /**
	 * To Update the Status of the Property on the Ledger.
	 * @param ctx - The transaction context object
	 * @param propertyID - Property ID of the Property
     * @param name - Name of the Owner
     * @param aadharNumber - Aadhar Number of the Owner
     * @param status - status of the Property
	 * @returns
	 */
	async updateProperty(ctx, propertyID, name, aadharNumber, status) {
        // Create a composite key for the user
        const userKey = ctx.stub.createCompositeKey('org.property-registration.user-regnet.user', [name, aadharNumber]);

		// Create a composite key for the Property
        const propertyKey = ctx.stub.createCompositeKey('org.property-registration.user-regnet.property', [propertyID]);
        
        // Return details of Property from blockchain
		let propertyBuffer = await ctx.stub
                            .getState(propertyKey)
                            .catch(err => console.log(err));

        let propertyObject = JSON.parse(propertyBuffer.toString());

        if(propertyObject.owner === userKey) {
            propertyObject.status = status;
            // Convert the JSON object to a buffer and send it to blockchain for storage
            let dataBuffer = Buffer.from(JSON.stringify(propertyObject));
            await ctx.stub.putState(propertyKey, dataBuffer);
            
            // Return value of new Request Object created to user
            return propertyObject;
        } else {
            throw new Error("User invoking this transaction is not the Owner of the Property");
        }
    }

    /**
	 * To Purchase Property.
	 * @param ctx - The transaction context object
	 * @param propertyID - Property ID of the Property
     * @param name - Name of the Buyer
     * @param aadharNumber - Aadhar Number of the Buyer
	 * @returns
	 */
	async purchaseProperty(ctx, propertyID, name, aadharNumber) {
        // Create a composite key for the Buyer
        const buyerKey = ctx.stub.createCompositeKey('org.property-registration.user-regnet.user', [name, aadharNumber]);
        // Return details of Buyer from blockchain
        let buyerBuffer = await ctx.stub
                        .getState(buyerKey)
                        .catch(err => console.log(err));
        let buyerObject = JSON.parse(buyerBuffer.toString());

		// Create a composite key for the Property
        const propertyKey = ctx.stub.createCompositeKey('org.property-registration.user-regnet.property', [propertyID]);
        // Return details of Property from blockchain
		let propertyBuffer = await ctx.stub
                            .getState(propertyKey)
                            .catch(err => console.log(err));
        let propertyObject = JSON.parse(propertyBuffer.toString());

        // Create a composite key for the Seller
        let sellerKey = propertyObject.owner;
        // Return details of Seller from blockchain
        let sellerBuffer = await ctx.stub
                            .getState(sellerKey)
                            .catch(err => console.log(err));
        let sellerObject = JSON.parse(sellerBuffer.toString());

        if(propertyObject.status === "onSale" && buyerObject.upgradCoins >= propertyObject.price) {
            propertyObject.owner = buyerKey; //  Owner of the Property is Updated.

            //  Updating the 'upgradCoins' for both 'Buyer' & 'Seller'.
            buyerObject.upgradCoins = buyerObject.upgradCoins - propertyObject.price;
            sellerObject.upgradCoins = sellerObject.upgradCoins + propertyObject.price;
            
            //  Updating the Status of the Property
            propertyObject.status = "registered";

            // Convert the JSON object to a buffer and send it to blockchain for storage
            let propertyBuffer = Buffer.from(JSON.stringify(propertyObject));
            await ctx.stub.putState(propertyKey, propertyBuffer);
            
            // Return value of updated Property Object.
            return propertyObject;
        } else {
            throw new Error("User invoking this transaction is not the Owner of the Property OR do not have sufficient balance");
        }
    }

}

module.exports = UserContract;