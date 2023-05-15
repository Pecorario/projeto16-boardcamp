import { Router } from "express";
import { createCustomer, deleteCustomer, editCustomerById, getCustomerById, getAllCustomers } from "../controllers/customers.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customers.schema.js";

const customersRouter = Router();

customersRouter.get("/customers", getAllCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", validateSchema(customerSchema), createCustomer);
customersRouter.delete("/customers/:id", deleteCustomer);
customersRouter.put("/customers/:id", validateSchema(customerSchema), editCustomerById);

export default customersRouter;