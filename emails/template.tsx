import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Heading,
    Text,
    Section,
  } from "@react-email/components";
  
  import * as React from "react";
  
  export default function EmailTemplate({
    userName = "Raj ",
    type = "budget-alert",
    data = { precentageUsed: 85, budgetAmount: 4000, totalExpenses: 3400 },
  }) {
    
    if (type === "monthly-report") {
      return (
        <Html>
          <Head />
          <Preview>Monthly Report</Preview>
          <Body style={styles.body}>
            <Container style={styles.container}>
              <Heading style={styles.title}>Monthly Report</Heading>
              <Text style={styles.text}>Hello {userName}</Text>
              <Text style={styles.text}>
                Here is your monthly report summary.
              </Text>
              {/* Add other report details here */}
            </Container>
          </Body>
        </Html>
      );
    }
  
    if (type === "budget-alert") {
      return (
        <Html>
          <Head />
          <Preview>Budget Alert</Preview>
          <Body style={styles.body}>
            <Container style={styles.container}>
              <Heading style={styles.title}>Budget Alert</Heading>
              <Text style={styles.text}>Hello {userName}</Text>
              <Text style={styles.text}>
                You&rsquo;ve used {data?.precentageUsed.toFixed(1)}% of your
                monthly budget.
              </Text>
              <Section style={styles.statsContainer}>
                <div style={styles.stat}>
                  <Text style={styles.text}>Budget Amount</Text>
                  <Text style={styles.heading}>${data?.budgetAmount}</Text>
                </div>
                <div style={styles.stat}>
                  <Text style={styles.text}>Spent so Far</Text>
                  <Text style={styles.heading}>${data?.totalExpenses}</Text>
                </div>
                <div style={styles.stat}>
                  <Text style={styles.text}>Remaining</Text>
                  <Text style={styles.heading}>
                    ${data?.budgetAmount - data?.totalExpenses}
                  </Text>
                </div>
              </Section>
            </Container>
          </Body>
        </Html>
      );
    }
  }
  
  const styles = {
    body: {
      backgroundColor: "#f6f9fc",
      fontFamily: "-apple-system, sans-serif",
      padding: "20px", // Add padding to the body for better spacing
    },
    container: {
      backgroundColor: "#ffffff",
      margin: "0 auto",
      padding: "20px",
      borderRadius: "5px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      width: "100%", // Make sure container width is responsive
      maxWidth: "600px", // Add max-width for better responsiveness
    },
    title: {
      color: "#1f2937",
      fontSize: "32px",
      fontWeight: "bold",
      textAlign: "center",
      margin: "0 0 20px",
    },
    heading: {
      color: "#1f2937",
      fontSize: "20px",
      fontWeight: "600",
      margin: "0 0 16px",
    },
    text: {
      color: "#4b5563",
      fontSize: "16px",
      margin: "0 0 16px",
    },
    section: {
      marginTop: "32px",
      padding: "20px",
      backgroundColor: "#f9fafb",
      borderRadius: "5px",
      border: "1px solid #e5e7eb",
    },
    statsContainer: {
      margin: "32px 0",
      padding: "20px",
      backgroundColor: "#f9fafb",
      borderRadius: "5px",
    },
    stat: {
      marginBottom: "16px",
      padding: "12px",
      backgroundColor: "#fff",
      borderRadius: "4px",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 0",
      borderBottom: "1px solid #e5e7eb",
    },
    footer: {
      color: "#6b7280",
      fontSize: "14px",
      textAlign: "center",
      marginTop: "32px",
      paddingTop: "16px",
      borderTop: "1px solid #e5e7eb",
    },
  };
  