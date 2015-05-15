app.factory('bill', [
	'$http',
	'api',
	'payment',
function($http, Api, Payment) {

	var billData = null;

	return {
		getBillingData: function(billModel, failureCallback, callback) {
			/**
			 * This is some dummy data if you need a utility to pay.
			 * Uncomment and replace the last parameter to angular.extend
			 * with dummy.
			 */

		    var dummy = {
		        utilityBalance: 100,
		        utilities: [
		        {
		            accountNumber: "1234",
		            address: "66 NATHANIEL DR",
		            currentBalance: 100,
		            disabledPaymentMessage: 'Whatevs',
		            dueDate: "2014-07-10T00:00:00",
		            enableAccountPayment: true,
		            enableCustomerPayment: true,
						id: "DRDF-123",
						paymentLink: '#',
						pendingPaymentTotal: 0,
						pendingPayments: [],
						type: 'Utility'
					}
		        ],
		        taxPropertyBalance: 3520,
		        taxProperties: [
               {
                   accountNumber: " ",
                   address: "66 NATHANIEL DR",
                   currentBalance: 3520,
                   disabledPaymentMessage: 'Whatevs',
                   dueDate: "2016-01-10T00:00:00",
                   enableAccountPayment: true,
                   enableCustomerPayment: true,
                   id: "DRDF-123",
                   paymentLink: '#',
                   pendingPaymentTotal: 0,
                   pendingPayments: [],
                   type: 'Real Property'
               }
		        ]
			};
			

			//billUrl = Api.getBillUrl();
			if(billData == null) {
				
					billData = angular.extend(billModel, dummy, {});
					console.log(billData);


			    callback();
			}
			else {
				angular.extend(billModel, dummy);
				callback();
			}
		},
		applyPayment: function(accountType, amount, accountId) {
			// This should be managed by the backend in the non-prototype
			if(billData.receipts == null)
			{
				billData.receipts = {
					'taxProperty': {},
					'utility': {}
				};
			}

			billData[accountType + 'Balance'] -= amount;

			var properties = billData[accountType == 'taxProperty' ? 'taxProperties' : 'utilities'];
			for(var i = 0; i < properties.length; i++)
			{
				if(properties[i].id == accountId)
				{
					properties[i].currentBalance -= amount;
					if(typeof(billData.receipts[accountType][accountId]) == "undefined")
					{
						billData.receipts[accountType][accountId] = [];
					}
					billData.receipts[accountType][accountId].push(amount);
				}
			}
			Payment.closeHandler();
		},
		getBillData: function() {
			return billData;
		},
		accountHasReceipt: function(type, id) {
			if(billData.receipts != null && billData.receipts[type][id] != undefined)
			{
				return true;
			}
			return false;
		}
	}
}]);
