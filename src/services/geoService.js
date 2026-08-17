async function lookupWithProviderA(ipAddress) {
  try {
    const response = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ipAddress)}`
    );

    if (!response.ok) {
      throw new Error(`Provider A returned ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "success") {
      throw new Error("Provider A could not resolve IP");
    }

    return {
      country: data.country || null,
      city: data.city || null,
      provider: "ip-api",
    };
  } catch (error) {
    console.error("Geo Provider A failed:", error.message);
    return null;
  }
}

async function lookupWithProviderB(ipAddress) {
  try {
    const response = await fetch(
      `https://ipapi.co/${encodeURIComponent(ipAddress)}/json/`
    );

    if (!response.ok) {
      throw new Error(`Provider B returned ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error("Provider B could not resolve IP");
    }

    return {
      country: data.country_name || null,
      city: data.city || null,
      provider: "ipapi",
    };
  } catch (error) {
    console.error("Geo Provider B failed:", error.message);
    return null;
  }
}

async function enrichIp(ipAddress) {
  const providerAResult = await lookupWithProviderA(ipAddress);

  if (providerAResult) {
    return providerAResult;
  }

  const providerBResult = await lookupWithProviderB(ipAddress);

  if (providerBResult) {
    return providerBResult;
  }

  return {
    country: null,
    city: null,
    provider: null,
  };
}

module.exports = {
  enrichIp,
};