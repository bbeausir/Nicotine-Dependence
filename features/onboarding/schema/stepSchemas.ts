import { onboardingStepConfig } from '@/features/onboarding/schema/stepConfig';

export const stepSchemas = onboardingStepConfig.map((step) => step.schema);
