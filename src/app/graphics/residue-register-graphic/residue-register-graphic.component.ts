import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ResiduesRegisterService } from 'src/services/residues-register.service';
import { AuthService } from 'src/services/auth.service';
import * as messageCode from 'message.code.json';
import { DepartamentService } from 'src/services/departament.service';
import { QrCode } from 'src/models/qrcode';
import { Material } from 'src/models/material';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
	selector: 'app-residue-register-graphic',
	templateUrl: './residue-register-graphic.component.html',
	styleUrls: [ './residue-register-graphic.component.scss' ]
})
export class ResidueRegisterGraphicComponent implements OnInit {
	page: number;
	corporationId: string;
	residuesRegister: any;
	materialName: any;
	departments: any;
	departmentsName: any;
	labelsName: any;
	unitsType: any;
	data: any;
	dataLine: any;
	options: any;
	optionsLine: any;
	dateInitial;
	dateFinal;
	unity;
	department;
	material;
	constructor(
		private toastr: ToastrService,
		private residuesRegisterService: ResiduesRegisterService,
		private authService: AuthService,
		private departmentService: DepartamentService
	) {}

	// name: department.name,
	// 				qrCode: qrCode.code,
	// 				type: qrCode.material.type,
	// 				material: qrCode.material.name,
	// 				unity: qrCode.material.unity,
	// 				weight: qrCode.material.weight,
	// 				quantity: qrCode.material.quantity
	//			labels: [ 'Departamento', 'QrCode', 'Tipo', 'Material', 'Unidade', 'Peso', 'Quantidade' ],

	ngOnInit() {
		this.residuesRegister = [];
		this.materialName = [];
		this.departments = [];
		this.departmentsName = [];
		this.authService.isAuthenticated();
		this.page = 1;
		this.corporationId = this.authService.getCorporationId();
		this.unitsType = Object.values(Material.Unit);
		this.loadValues();
	}

	async loadValues() {
		await this.loadDepartments();
		await this.loadResiduesRegister();
		await this.generatePieGraph(this.residuesRegister);
		await this.generateLineGraph(this.residuesRegister);
	}
	async loadResiduesRegister() {
		var residuesRegister = undefined;
		try {
			residuesRegister = await new Promise((resolve, reject) => {
				residuesRegister = this.residuesRegisterService.allResiduesRegister(
					this.authService.getClass(),
					this.corporationId,
					resolve,
					reject
				);
			});
			this.insertValues(residuesRegister);
		} catch (error) {
			console.log(error);
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	private insertValues(residuesRegister: any) {
		this.materialName = [];
		if (
			residuesRegister !== null &&
			residuesRegister.departments !== undefined &&
			residuesRegister.departments.length > 0
		) {
			this.residuesRegister = JSON.parse(JSON.stringify(residuesRegister));
			this.residuesRegister.departments.forEach((departments) => {
				departments.qrCode.forEach((qrcode) => {
					this.materialName.push(qrcode.material.name);
				});
			});
		}
	}

	async loadDepartments() {
		var departments = undefined;
		this.departments = undefined;
		try {
			departments = await new Promise((resolve, reject) => {
				departments = this.departmentService.allDepartaments(
					this.authService.getClass(),
					this.corporationId,
					resolve,
					reject
				);
			});

			if (departments) {
				this.departments = departments;
				this.departments.forEach((department) => {
					this.departmentsName.push(department.name);
				});
			}
		} catch (error) {
			this.toastr.error(messageCode['WARNNING'][error]['summary']);
		}
	}

	generateLineGraph(item) {
		var values = [];
		var datasets = [];
		this.departmentsName.forEach((name) => {
			var department = item.departments.find((x) => x.name === name);
			var mouth = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
			department.qrCode.forEach((qrCode) => {
				var date = new Date(qrCode.date);
				var index = date.getMonth();
				mouth[index] += this.calcWeight(qrCode.material);
			});

			var dataset = {
				label: name,
				fill: true,
				borderWidth: 2,
				fillColor: this.dynamicColors(),
				strokeColor: this.dynamicColors(),
				borderColor: this.dynamicColors(),
				data: mouth
			};
			datasets.push(dataset);
		});

		this.dataLine = {
			labels: [
				'Janeiro',
				'Fevereiro',
				'Março',
				'Abril',
				'Maio',
				'Junho',
				'Julho',
				'Agosto',
				'Setembro',
				'Outubro',
				'Novembro',
				'Dezembro'
			],
			datasets
		};

		this.optionsLine = {
			responsive: true,
			maintainAspectRatio: true,
			pan: {
				enabled: true,
				mode: 'xy'
			},
			zoom: {
				enabled: true,
				mode: 'xy'
			}
		};
	}

	selectData(item) {}

	generatePieGraph(item) {
		if (!item || item.departments.length <= 0) {
			item = this.residuesRegister;
		}
		var values = [];
		var labels = [];
		var backgroundColor = [];
		var hoverBackgroundColor = [];
		item.departments.forEach((department) => {
			var value = 0;
			department.qrCode.forEach((qrCode) => {
				value += this.calcWeight(qrCode.material);
			});
			values.push(value);
			labels.push(department.name);
			backgroundColor.push(this.dynamicColors());
			hoverBackgroundColor.push(this.dynamicColors());
		});
		this.data = {
			labels: labels,
			datasets: [
				{
					data: values,
					backgroundColor: backgroundColor,
					hoverBackgroundColor: hoverBackgroundColor
				}
			]
		};
		this.options = {
			responsive: true,
			maintainAspectRatio: true,
			plugins: {
				labels: {
					render: 'percentage',
					fontColor: [ this.dynamicColors() ],
					precision: 2,
					fontSize: 16
				}
			}
		};
	}

	calcWeight(item) {
		var value = 0;
		if (item.unity === Material.Unit.T) {
			value = item.weight * 1000;
			return value;
		}
		if (item.unity === Material.Unit.L) {
			value = item.weight;
			return value;
		} else {
			value = item.weight;
			return value;
		}
	}

	private dynamicColors() {
		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);
		return 'rgb(' + r + ',' + g + ',' + b + ')';
	}
}
