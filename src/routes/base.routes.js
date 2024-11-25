import { Router } from "express";
import SchemaValidator from "../utils/schema-validator";

export class BaseRoutes {
	constructor() {
		this.router = new Router()
		this.SchemaValidator = SchemaValidator
	}
}
