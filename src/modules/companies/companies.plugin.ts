import { createSecurePlugin } from '../../app/routing/secure-router';
import {
    ListCompaniesController,
    GetCompanyController,
    CreateCompanyController,
    UpdateCompanyController,
    DeleteCompanyController,
} from './companies.controller';

export const companiesPlugin = createSecurePlugin('companies', '/api/v1', [
    { method: 'get', path: 'companies', controller: ListCompaniesController },
    { method: 'get', path: 'companies/:id', controller: GetCompanyController },
    { method: 'post', path: 'companies', controller: CreateCompanyController },
    { method: 'put', path: 'companies/:id', controller: UpdateCompanyController },
    { method: 'delete', path: 'companies/:id', controller: DeleteCompanyController },
]);
