import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DocumentsManagementService } from 'src/services/documents-management.service';
import { AuthService } from 'src/services/auth.service';
import * as messageCode from 'message.code.json';
import { EntriesTypes } from 'src/models/entries';
import { Document } from 'src/models/document';
import { Archive } from 'src/models/archive';
import { ArchiveService } from '../../services/archive.service';
var myReader: FileReader = new FileReader();
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-documents-management',
	templateUrl: './documents-management.component.html',
	styleUrls: [ './documents-management.component.scss' ]
})
export class DocumentsManagementComponent implements OnInit {
	page: number;
	corporationId: string;
	documents: any;
	newDocuments: any;
	types;
	expires;
	fileData: File = null;
	expandNew;
	expandDocument;

	constructor(
		private toastr: ToastrService,
		private documentsService: DocumentsManagementService,
		private authService: AuthService,
		private archiveService: ArchiveService,
		private datePipe: DatePipe
	) {
		this.documents = [];
		this.newDocuments = [];
	}

	ngOnInit() {
		this.authService.isAuthenticated();
		this.page = 1;
		this.types = Object.values(Document.Type);
		this.expires = Object.values(Document.Expire);
		this.corporationId = this.authService.getCorporationId();
		this.loadDocuments();
	}

	async loadDocuments() {
		var documents = undefined;
		try {
			documents = await new Promise((resolve, reject) => {
				documents = this.documentsService.allDocuments(
					this.authService.getClass(),
					this.corporationId,
					resolve,
					reject
				);
			});

			if (documents) {
				this.documents = documents;
				this.daysNotification(this.documents);
			}
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	newItem() {
		var item = new Document();
		item.expire = false;
		item['changed'] = true;
		this.newDocuments.push(item);
	}

	expandCreate() {
		if (!this.expandNew) {
			this.expandNew = true;
		} else {
			this.expandNew = false;
		}
	}

	expandDocuments() {
		if (!this.expandDocument) {
			this.expandDocument = true;
		} else {
			this.expandDocument = false;
		}
	}

	fileProgress(event) {
		this.fileData = <File>event.target.files[0];
	}

	async uploadDocument(item) {
		try {
			item.changed = true;
			var object;
			var document = new Archive();
			myReader.readAsDataURL(this.fileData);
			myReader.onloadend = async (e) => {
				object = myReader.result;
				document.name = '_' + Date.now() + this.fileData.name;
				document.file = object;
				var result = await new Promise(async (resolve, reject) => {
					this.archiveService.uploadArchive(undefined, document, resolve, reject);
				});
				this.toastr.info(messageCode['INFO']['IRE008']['summary']);
				item.archive = document.name;
			};
		} catch (error) {
			console.log(error);
			this.toastr.warning(messageCode['WARNNING']['WRE021']['summary']);
		}
	}

	Expire(item) {
		if (item.expire) {
			item.changed = true;
		} else {
			item.changed = true;
			item.daysNotification = 0;
			item.date = undefined;
		}
	}

	ChangedItem(item) {
		item.changed = true;
	}

	ChangeDate(event, item) {
		item.date = event;
		item.changed = true;
	}

	daysNotification(items) {
		var days;
		var value = new Date().toDateString();
		var today = new Date(value);
		items.forEach((item) => {
			if (item.expire) {
				var date = new Date(item.date);
				var timeDiff;
				if (date.getTime() < today.getTime()) {
					timeDiff = date.getTime() - today.getTime();
				} else {
					timeDiff = Math.abs(date.getTime() - today.getTime());
				}
				days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
				if (date < today) {
					item.status = Document.Status.closed;
					item.color = 'rgba(244, 64, 52, 0.65)';
				} else if (0 < days && days < item.daysNotification) {
					item.status = Document.Status.alert;
					item.color = 'rgba(255, 193, 5, 0.65)';
				} else if (0 < days && days > item.daysNotification) {
					item.status = Document.Status.ok;
					item.color = 'rgba(0, 148, 133, 0.65)';
				} else if (date.getDate() === today.getDate()) {
					item.status = Document.Status.alert;
					item.color = 'rgba(255, 193, 5, 0.65)';
				}
			} else {
				item.status = Document.Status.notExpire;
				item.color = 'rgba(2, 166, 242, 0.65)';
			}
		});
	}

	veryfyBeforeSave() {
		if (this.newDocuments === undefined || this.newDocuments.length <= 0) {
			this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
			throw new Error();
		}
		this.newDocuments.forEach((document) => {
			if (document.type === undefined || document.type === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (document.name === undefined || document.name === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (document.archive === undefined || document.archive === undefined) {
				this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
				throw new Error();
			}
			if (document.expire) {
				if (document.daysNotification === undefined || document.daysNotification === undefined) {
					this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
					throw new Error();
				}
				if (document.date === undefined || document.date === undefined) {
					this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
					throw new Error();
				}
			}
		});
	}

	removeInvalidaValuesToSave() {
		this.newDocuments.forEach((document, index) => {
			delete document.changed;
			delete document.color;
			delete document.status;
		});
	}

	removeNotChangedScheduling() {
		this.newDocuments.forEach((document, index) => {
			if (!document.changed) {
				this.documents.splice(index, 1);
			}
		});
	}

	resetDocuments(items) {
		this.documents = items;
		this.daysNotification(this.documents);
	}

	verifyUpdate() {
		this.documents.forEach((doc) => {
			if (doc.changed) {
				this.newDocuments.push(doc);
			}
		});
	}

	async save() {
		try {
			this.verifyUpdate();
			this.removeNotChangedScheduling();
			this.removeInvalidaValuesToSave();
			this.veryfyBeforeSave();
			if (this.newDocuments.length <= 0) {
				this.toastr.warning(messageCode['WARNNING']['WRE020']['summary']);
				return;
			}

			var documents = await new Promise(async (resolve, reject) => {
				this.documentsService.addOrUpdate(
					this.authService.getClass(),
					this.corporationId,
					this.newDocuments,
					resolve,
					reject
				);
			});
			this.resetDocuments(documents);
			this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
		} catch (error) {
			this.toastr.warning(messageCode['ERROR'][error]['summary']);
		}
	}
}
