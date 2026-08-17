(async function () {
  const currentScript = document.currentScript;

  if (!currentScript) {
    console.error("Widget script could not determine its own source.");
    return;
  }

  const scriptUrl = new URL(currentScript.src);
  const widgetId = scriptUrl.searchParams.get("id");

  if (!widgetId) {
    console.error("Widget ID is missing.");
    return;
  }

  try {
    const apiBaseUrl = scriptUrl.origin;

    const response = await fetch(
      `${apiBaseUrl}/widgets/${widgetId}/config`
    );

    if (!response.ok) {
      throw new Error(`Failed to load widget config: ${response.status}`);
    }

    const config = await response.json();

    const container = document.createElement("div");

    container.innerHTML = `
      <div>
        <h3>${config.title}</h3>
        <p>${config.description}</p>
        <button type="button">${config.button_text}</button>
      </div>
    `;

    currentScript.insertAdjacentElement("afterend", container);
  } catch (error) {
    console.error("Widget failed to load:", error);
  }
})();