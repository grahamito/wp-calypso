function list() {
	return '/purchases';
}

function listNotice( noticeType = ':noticeType' ) {
	return list() + `/${ noticeType }`;
}

function managePurchase( siteName = ':site', purchaseId = ':purchaseId' ) {
	return list() + `/${ siteName }/${ purchaseId }`;
}

function managePurchaseDestination( siteName = ':site', purchaseId = ':purchaseId', destinationType = ':destinationType?' ) {
	return managePurchase( siteName, purchaseId ) + `/${ destinationType }`;
}

function cancelPurchase( siteName, purchaseId ) {
	return managePurchase( siteName, purchaseId ) + '/cancel';
}

function confirmCancelPurchase( siteName, purchaseId ) {
	return managePurchase( siteName, purchaseId ) + '/confirm-cancel';
}

function cancelPrivateRegistration( siteName, purchaseId ) {
	return managePurchase( siteName, purchaseId ) + '/cancel-private-registration';
}

function editCardDetails( siteName, purchaseId ) {
	return editPaymentMethod( siteName, purchaseId ) + `/edit`;
}

function editSpecificCardDetails( siteName, purchaseId, cardId = ':cardId' ) {
	return editPaymentMethod( siteName, purchaseId ) + `/edit/${ cardId }`;
}

function editPaymentMethod( siteName, purchaseId ) {
	return managePurchase( siteName, purchaseId ) + '/payment';
}

export default {
	cancelPrivateRegistration,
	cancelPurchase,
	confirmCancelPurchase,
	editCardDetails,
	editPaymentMethod,
	editSpecificCardDetails,
	list,
	listNotice,
	managePurchase,
	managePurchaseDestination
};
