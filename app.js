// Simple HealthConnect demo app
// Represents the patient portal referenced in the assignment brief
const ENVIRONMENT = "unknown";

function healthCheck() {
  console.log(`HealthConnect is running in ${ENVIRONMENT} environment`);
  console.log("Status: healthy");
  return { status: "healthy", environment: ENVIRONMENT };
}


healthCheck();
