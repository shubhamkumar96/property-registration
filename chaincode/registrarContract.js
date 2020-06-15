'use strict';

const {Contract} = require('fabric-contract-api');

class RegistrarContract extends Contract {
	
	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.property-registration.registrar-regnet');
	}
	
	/* ****** All custom functions are defined below ***** */
	
	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('Regnet Registrar Smart Contract Instantiated');
	}
	
	/**
	 * To Register a new user on the Ledger based on the request received.
	 * @param ctx - The transaction context object
	 * @param name - Name of the user
	 * @param aadharNumber - Aadhar Number of the user
	 * @returns
	 */
	async approveNewUser(ctx, name, aadharNumber) {
		// Create a new composite key for the new user
		const userKey = ctx.stub.createCompositeKey('org.property-registration.user-regnet.user', [name, aadharNumber]);
        
        // Return details of user from blockchain
		let userBuffer = await ctx.stub
                            .getState(userKey)
                            .catch(err => console.log(err));

        let userObject = JSON.parse(userBuffer.toString());
        userObject.upgradCoins = 0;

        // Convert the JSON object to a buffer and send it to blockchain for storage
		let dataBuffer = Buffer.from(JSON.stringify(userObject));
        await ctx.stub.putState(userKey, dataBuffer);
        
		// Return value of new Request Object created to user
		return userObject;
    }
    
    
    /**
	 * To Register a Property on the Ledger based on the request received.
	 * @param ctx - The transaction context object
	 * @param propertyID - Property ID of the Property
	 * @returns
	 */
	async approvePropertyRegistration(ctx, propertyID) {
		// Create a composite key for the Property
        const propertyKey = ctx.stub.createCompositeKey('org.property-registration.user-regnet.property', [propertyID]);
        
        // Return details of Property from blockchain
		let propertyBuffer = await ctx.stub
                            .getState(propertyKey)
                            .catch(err => console.log(err));

        let propertyObject = JSON.parse(propertyBuffer.toString());

        // Convert the JSON object to a buffer and send it to blockchain for storage
		let dataBuffer = Buffer.from(JSON.stringify(propertyObject));
        await ctx.stub.putState(propertyKey, dataBuffer);
        
		// Return value of new Request Object created to user
		return propertyObject;
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

}

module.exports = RegistrarContract;