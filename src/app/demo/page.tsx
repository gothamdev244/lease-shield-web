"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLeaseStore } from "@/lib/store";
import type { AnalysisResult } from "@/lib/types";

const MOCK_ANALYSIS: AnalysisResult = {
  clauses: [
    {
      clauseText: "The Tenant shall pay a security deposit of Rs. 6,00,000 (Six Lakhs) being equivalent to 6 months rent.",
      category: "legal-violation",
      title: "Excessive Security Deposit",
      explanation: "This deposit exceeds the legal cap. For residential premises, security deposit is capped at 2 months' rent under the Model Tenancy Act.",
      lawReference: "Model Tenancy Act 2021, Section 8",
      action: "I'd like to discuss the security deposit. Under Section 8 of the Model Tenancy Act, the maximum security deposit for residential premises is 2 months' rent. I'd request this be revised to Rs. 2,00,000.",
      severity: "high",
    },
    {
      clauseText: "The Tenant shall get the entire premises painted at their own cost at the time of vacating.",
      category: "financial-trap",
      title: "Mandatory Painting Charges",
      explanation: "Painting due to normal wear and tear is the landlord's responsibility. Forcing tenants to paint on exit is an unfair deduction commonly used to reduce deposit refunds.",
      lawReference: "Indian Contract Act, Section 23; Consumer Protection Act, 2019",
      action: "This clause about mandatory painting contradicts the principle that normal wear and tear is not the tenant's liability. I'd request this be modified to 'Tenant shall be responsible only for damage beyond normal wear and tear.'",
      severity: "medium",
    },
    {
      clauseText: "The Tenant shall not keep any pets in the premises under any circumstances.",
      category: "hidden-risk",
      title: "Blanket Pet Restriction",
      explanation: "No Indian law prohibits pet ownership in rented premises. Such blanket clauses have been challenged in consumer courts. However, the landlord can set reasonable conditions.",
      lawReference: "Animal Welfare Board guidelines; Consumer Court precedents",
      action: "While I understand your concerns, a blanket pet ban lacks legal backing. Could we modify this to allow pets with reasonable conditions (e.g., pet deposit, no damage clause)?",
      severity: "medium",
    },
    {
      clauseText: "This agreement is for a lock-in period of 11 months. If the Tenant vacates before this period, the entire security deposit shall be forfeited.",
      category: "lock-in-issue",
      title: "Full Deposit Forfeiture on Early Exit",
      explanation: "Forfeiting the entire deposit for early exit is unconscionable. A proportional penalty is reasonable, but total forfeiture is unfair and likely unenforceable.",
      lawReference: "Indian Contract Act, Section 74 (reasonable compensation)",
      action: "Full forfeiture of deposit on early exit is excessive under Section 74 of the Indian Contract Act. I'd suggest a proportional penalty instead — e.g., 1 month's rent for each month short of the lock-in period.",
      severity: "high",
    },
    {
      clauseText: "Monthly rent of Rs. 1,00,000 shall be payable on or before the 5th of every month via bank transfer.",
      category: "standard",
      title: "Standard Rent Payment Terms",
      explanation: "Standard rent payment clause with a reasonable due date and traceable payment method.",
      lawReference: "Model Tenancy Act 2021, Section 6",
      action: "This is a standard clause. The 5th of each month is a reasonable due date and bank transfer provides a clear payment trail.",
      severity: "low",
    },
    {
      clauseText: "The Landlord may increase the rent by 15% annually without prior notice to the Tenant.",
      category: "legal-violation",
      title: "Excessive Rent Escalation",
      explanation: "A 15% annual increase without notice is unreasonable. Standard practice in India is 5-10% with advance notice.",
      lawReference: "Model Tenancy Act 2021, Section 9",
      action: "A 15% annual escalation without notice is excessive. I'd request capping this at 8-10% per annum with a minimum 3 months' written notice, which is standard market practice.",
      severity: "high",
    },
  ],
  summary: {
    total: 6,
    violations: 2,
    risks: 1,
    traps: 2,
    safe: 1,
  },
};

export default function DemoPage() {
  const router = useRouter();
  const store = useLeaseStore();

  useEffect(() => {
    store.setLeaseText("Sample lease text for demo purposes.");
    store.setAnalysis(MOCK_ANALYSIS);
    router.replace("/report");
  }, []);

  return (
    <main className="flex flex-1 items-center justify-center">
      <p className="text-muted">Loading demo...</p>
    </main>
  );
}
