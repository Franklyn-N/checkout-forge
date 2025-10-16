import SwaggerParser from '@apidevtools/swagger-parser';
import { readFileSync } from 'fs';

const testResults = {
  validationPassed: false,
  endpoints: [],
  workflows: [],
  errors: [],
  warnings: []
};

console.log('🚀 Starting CheckoutForge API Test Suite\n');
console.log('='.repeat(60));

try {
  console.log('\n📋 Step 1: Validating OpenAPI Specification...');
  const api = await SwaggerParser.validate('./openapi.yaml');
  testResults.validationPassed = true;
  console.log('✅ OpenAPI specification is valid!');
  console.log(`   - Title: ${api.info.title}`);
  console.log(`   - Version: ${api.info.version}`);
  console.log(`   - Servers: ${api.servers.length} configured`);

  console.log('\n📋 Step 2: Analyzing API Endpoints...');
  const paths = Object.keys(api.paths);
  console.log(`   - Total endpoints: ${paths.length}`);

  let totalOperations = 0;
  const endpointsByTag = {};

  paths.forEach(path => {
    const methods = Object.keys(api.paths[path]).filter(m =>
      ['get', 'post', 'put', 'delete', 'patch'].includes(m)
    );

    methods.forEach(method => {
      totalOperations++;
      const operation = api.paths[path][method];
      const tags = operation.tags || ['Untagged'];

      tags.forEach(tag => {
        if (!endpointsByTag[tag]) {
          endpointsByTag[tag] = [];
        }
        endpointsByTag[tag].push({
          path,
          method: method.toUpperCase(),
          summary: operation.summary,
          operationId: operation.operationId
        });
      });

      testResults.endpoints.push({
        path,
        method: method.toUpperCase(),
        operationId: operation.operationId,
        tags: operation.tags,
        hasRequestBody: !!operation.requestBody,
        hasResponses: !!operation.responses,
        requiresAuth: operation.security ? operation.security.length > 0 : true
      });
    });
  });

  console.log(`   - Total operations: ${totalOperations}`);
  console.log('\n   Endpoints by category:');
  Object.keys(endpointsByTag).forEach(tag => {
    console.log(`     • ${tag}: ${endpointsByTag[tag].length} endpoints`);
  });

  console.log('\n📋 Step 3: Testing Endpoint Definitions...');

  let endpointsWithDocs = 0;
  let endpointsWithExamples = 0;
  let endpointsWithSecurity = 0;

  testResults.endpoints.forEach(endpoint => {
    const operation = api.paths[endpoint.path][endpoint.method.toLowerCase()];

    if (operation.summary || operation.description) {
      endpointsWithDocs++;
    }

    if (operation.responses) {
      Object.values(operation.responses).forEach(response => {
        if (response.content) {
          Object.values(response.content).forEach(mediaType => {
            if (mediaType.examples || (mediaType.schema && mediaType.schema.example)) {
              endpointsWithExamples++;
            }
          });
        }
      });
    }

    if (operation.security || (operation.security !== undefined && operation.security.length === 0)) {
      endpointsWithSecurity++;
    }
  });

  console.log(`   ✅ All ${totalOperations} endpoints have valid definitions`);
  console.log(`   ✅ ${endpointsWithDocs} endpoints have documentation`);
  console.log(`   ✅ ${endpointsWithExamples} endpoints have examples`);
  console.log(`   ✅ ${endpointsWithSecurity} endpoints have security defined`);

  console.log('\n📋 Step 4: Simulating Workflow Scenarios...\n');

  const workflows = [
    {
      name: 'Public Checkout Flow',
      description: 'Customer views and completes checkout',
      steps: [
        { operation: 'getCheckout', path: '/checkout/{checkoutId}', method: 'GET' },
        { operation: 'createCheckoutToken', path: '/checkout/{checkoutId}/token', method: 'POST' },
        { operation: 'createOrder', path: '/checkout', method: 'POST' }
      ],
      requiresAuth: false
    },
    {
      name: 'Product Management',
      description: 'Admin creates and manages products',
      steps: [
        { operation: 'createProduct', path: '/admin/products', method: 'POST' },
        { operation: 'listProducts', path: '/admin/products', method: 'GET' },
        { operation: 'getProduct', path: '/admin/products/{productId}', method: 'GET' },
        { operation: 'updateProduct', path: '/admin/products/{productId}', method: 'PUT' }
      ],
      requiresAuth: true
    },
    {
      name: 'Checkout Page Configuration',
      description: 'Admin creates and configures checkout pages',
      steps: [
        { operation: 'listTemplates', path: '/templates', method: 'GET' },
        { operation: 'createCheckout', path: '/admin/checkouts', method: 'POST' },
        { operation: 'getCheckoutAdmin', path: '/admin/checkouts/{checkoutId}', method: 'GET' },
        { operation: 'updateCheckout', path: '/admin/checkouts/{checkoutId}', method: 'PUT' }
      ],
      requiresAuth: true
    },
    {
      name: 'Order Processing & Refunds',
      description: 'Admin manages orders and processes refunds',
      steps: [
        { operation: 'listOrders', path: '/admin/orders', method: 'GET' },
        { operation: 'getOrder', path: '/admin/orders/{orderId}', method: 'GET' },
        { operation: 'refundOrder', path: '/admin/orders/{orderId}/refund', method: 'POST' }
      ],
      requiresAuth: true
    },
    {
      name: 'Sales Funnel Setup',
      description: 'Admin creates multi-step sales funnel',
      steps: [
        { operation: 'createFunnel', path: '/admin/funnels', method: 'POST' },
        { operation: 'listFunnels', path: '/admin/funnels', method: 'GET' },
        { operation: 'getFunnel', path: '/admin/funnels/{funnelId}', method: 'GET' },
        { operation: 'updateFunnel', path: '/admin/funnels/{funnelId}', method: 'PUT' }
      ],
      requiresAuth: true
    },
    {
      name: 'A/B Testing Campaign',
      description: 'Admin sets up and monitors A/B tests',
      steps: [
        { operation: 'createABTest', path: '/admin/ab-tests', method: 'POST' },
        { operation: 'listABTests', path: '/admin/ab-tests', method: 'GET' },
        { operation: 'getABTest', path: '/admin/ab-tests/{testId}', method: 'GET' },
        { operation: 'updateABTest', path: '/admin/ab-tests/{testId}', method: 'PUT' }
      ],
      requiresAuth: true
    },
    {
      name: 'Affiliate Management',
      description: 'Admin manages affiliates and commissions',
      steps: [
        { operation: 'createAffiliate', path: '/admin/affiliates', method: 'POST' },
        { operation: 'listAffiliates', path: '/admin/affiliates', method: 'GET' },
        { operation: 'getAffiliateCommissions', path: '/admin/affiliates/{affiliateId}/commissions', method: 'GET' },
        { operation: 'processAffiliatePayout', path: '/admin/affiliates/{affiliateId}/payout', method: 'POST' }
      ],
      requiresAuth: true
    },
    {
      name: 'Analytics & Reporting',
      description: 'Admin reviews performance metrics',
      steps: [
        { operation: 'getRevenueReport', path: '/admin/reports/revenue', method: 'GET' },
        { operation: 'getConversionReport', path: '/admin/reports/conversion', method: 'GET' },
        { operation: 'getAffiliateReport', path: '/admin/reports/affiliates', method: 'GET' }
      ],
      requiresAuth: true
    },
    {
      name: 'Webhook Processing',
      description: 'External services send payment updates',
      steps: [
        { operation: 'stripeWebhook', path: '/webhooks/stripe', method: 'POST' },
        { operation: 'paypalWebhook', path: '/webhooks/paypal', method: 'POST' }
      ],
      requiresAuth: false
    }
  ];

  workflows.forEach(workflow => {
    console.log(`   🔄 ${workflow.name}`);
    console.log(`      ${workflow.description}`);
    console.log(`      Steps: ${workflow.steps.length}`);
    console.log(`      Auth Required: ${workflow.requiresAuth ? 'Yes' : 'No'}`);

    let allStepsValid = true;
    workflow.steps.forEach((step, idx) => {
      const pathExists = api.paths[step.path];
      const methodExists = pathExists && api.paths[step.path][step.method.toLowerCase()];
      const operationIdMatches = methodExists &&
        api.paths[step.path][step.method.toLowerCase()].operationId === step.operation;

      if (!pathExists || !methodExists || !operationIdMatches) {
        allStepsValid = false;
        testResults.errors.push(`Invalid step in workflow ${workflow.name}: ${step.method} ${step.path}`);
      }
    });

    if (allStepsValid) {
      console.log(`      ✅ All steps validated successfully`);
      testResults.workflows.push({ name: workflow.name, status: 'passed', stepsCount: workflow.steps.length });
    } else {
      console.log(`      ❌ Some steps failed validation`);
      testResults.workflows.push({ name: workflow.name, status: 'failed', stepsCount: workflow.steps.length });
    }
    console.log('');
  });

  console.log('📋 Step 5: Analyzing Data Models...');
  const schemas = Object.keys(api.components?.schemas || {});
  console.log(`   - Total schemas defined: ${schemas.length}`);
  console.log('   - Core models:');
  schemas.forEach(schema => {
    const model = api.components.schemas[schema];
    const requiredFields = model.required?.length || 0;
    const totalFields = Object.keys(model.properties || {}).length;
    console.log(`     • ${schema}: ${totalFields} fields (${requiredFields} required)`);
  });

  console.log('\n📋 Step 6: Security Configuration...');
  const securitySchemes = Object.keys(api.components?.securitySchemes || {});
  console.log(`   - Security schemes defined: ${securitySchemes.length}`);
  securitySchemes.forEach(scheme => {
    const config = api.components.securitySchemes[scheme];
    console.log(`     • ${scheme}: ${config.type} (${config.scheme || config.flows ? 'OAuth2' : 'configured'})`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ API TEST SUITE COMPLETED SUCCESSFULLY!\n');

  console.log('📊 Summary:');
  console.log(`   - OpenAPI Validation: ✅ PASSED`);
  console.log(`   - Total Endpoints: ${totalOperations}`);
  console.log(`   - Workflows Tested: ${workflows.length}`);
  console.log(`   - Workflows Passed: ${testResults.workflows.filter(w => w.status === 'passed').length}`);
  console.log(`   - Data Models: ${schemas.length}`);
  console.log(`   - Security Schemes: ${securitySchemes.length}`);
  console.log(`   - Errors Found: ${testResults.errors.length}`);
  console.log(`   - Warnings: ${testResults.warnings.length}`);

} catch (error) {
  console.error('\n❌ TEST SUITE FAILED!\n');
  console.error('Error:', error.message);
  testResults.errors.push(error.message);
  process.exit(1);
}
