import { QrCode } from './qrcode';

export class CheckPoints {
	wastegenerated: {
		qrCode: [QrCode];
	};
	collectionrequested: {
		qrCode: [QrCode];
	};
	collectionperformed: {
		qrCode: [QrCode];
	};
	arrivedcollector: {
		qrCode: [QrCode];
	};
	insorting: {
		qrCode: [QrCode];
	};
	completedestination: {
		qrCode: [QrCode];
	};
}
