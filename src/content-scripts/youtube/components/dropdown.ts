// src/content-scripts/youtube/components/dropdown.ts
import { storageBridge } from "../bridge/bridge";

interface DropdownConfig {
  autoLoop: boolean;
  qualityService: boolean;
  autoCaption: boolean;
}

type ConfigKey = keyof DropdownConfig;

const STORAGE_KEY = "dropdown_config";

const DEFAULT_CONFIG: DropdownConfig = {
  autoLoop: true,
  qualityService: true,
  autoCaption: true,
};

const TOGGLE_ITEMS: Array<{ id: ConfigKey; label: string }> = [
  { id: "autoLoop", label: "Auto Loop" },
  { id: "qualityService", label: "Quality Service" },
  { id: "autoCaption", label: "Auto Caption" },
];

export class Dropdown {
  private container: HTMLElement | null = null;
  private button: HTMLElement | null = null;
  private menu: HTMLElement | null = null;
  private config: DropdownConfig = { ...DEFAULT_CONFIG };
  private isOpen = false;
  private cleanupFns: Array<() => void> = [];

  async init() {
    await this.loadConfig();
    this.createUI();
    this.attachListeners();
  }

  private async loadConfig() {
    try {
      const saved = await storageBridge.get(STORAGE_KEY);
      if (saved) {
        this.config = { ...DEFAULT_CONFIG, ...saved };
      }
    } catch (error) {
      console.warn("Failed to load dropdown config:", error);
    }
  }

  private createUI() {
    this.createContainer();
    this.createButton();
    this.createMenu();
  }

  private createContainer() {
    this.container = document.createElement("div");
    this.container.id = "yt-enhancer-dropdown";
  }

  private createButton() {
    this.button = document.createElement("button");
    this.button.id = "yt-enhancer-dropdown-button";
    this.button.setAttribute("aria-label", "YT Enhancer Settings");
    this.button.setAttribute("aria-expanded", "false");
    this.button.innerHTML = this.getSettingsIconSVG();

    this.container?.appendChild(this.button);
  }

  private createMenu() {
    this.menu = document.createElement("div");
    this.menu.id = "yt-enhancer-menu";
    this.menu.setAttribute("role", "menu");

    const header = document.createElement("div");
    header.id = "yt-enhancer-menu-header";
    header.textContent = "YT Enhancer Settings";

    this.menu.appendChild(header);

    // Create toggle items
    TOGGLE_ITEMS.forEach(({ id, label }) => {
      this.menu?.appendChild(this.createToggleItem(id, label));
    });
  }

  private createToggleItem(id: ConfigKey, label: string): HTMLElement {
    const item = document.createElement("div");
    item.className = "toggle-item";
    item.setAttribute("data-id", id);
    item.setAttribute("role", "menuitemcheckbox");
    item.setAttribute("aria-checked", String(this.config[id]));

    const labelSpan = document.createElement("span");
    labelSpan.className = "toggle-item-label";
    labelSpan.textContent = label;

    const toggleSwitch = this.createToggleSwitch(this.config[id]);

    item.append(labelSpan, toggleSwitch);
    return item;
  }

  private createToggleSwitch(isActive: boolean): HTMLElement {
    const toggleSwitch = document.createElement("div");
    toggleSwitch.className = `toggle-switch ${isActive ? "active" : ""}`;

    const toggleKnob = document.createElement("div");
    toggleKnob.className = "toggle-knob";

    toggleSwitch.appendChild(toggleKnob);
    return toggleSwitch;
  }

  private attachListeners() {
    this.attachButtonListener();
    this.attachMenuListener();
    this.attachDocumentListeners();
  }

  private attachButtonListener() {
    if (!this.button) return;

    const handleClick = (e: Event) => {
      e.stopPropagation();
      this.toggleMenu();
    };

    this.button.addEventListener("click", handleClick);
    this.cleanupFns.push(() =>
      this.button?.removeEventListener("click", handleClick),
    );
  }

  private attachMenuListener() {
    if (!this.menu) return;

    // Event delegation for toggle items
    const handleMenuClick = (e: Event) => {
      e.stopPropagation();

      const target = e.target as HTMLElement;
      const item = target.closest<HTMLElement>(".toggle-item");

      if (item) {
        this.handleToggle(item);
      }
    };

    this.menu.addEventListener("click", handleMenuClick);
    this.cleanupFns.push(() =>
      this.menu?.removeEventListener("click", handleMenuClick),
    );
  }

  private attachDocumentListeners() {
    const handleDocumentClick = () => {
      if (this.isOpen) this.closeMenu();
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeMenu();
      }
    };

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleKeydown);

    this.cleanupFns.push(() => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleKeydown);
    });
  }

  private handleToggle(item: HTMLElement) {
    const id = item.getAttribute("data-id") as ConfigKey | null;
    if (!id || !(id in this.config)) return;

    const toggleSwitch = item.querySelector<HTMLElement>(".toggle-switch");
    if (!toggleSwitch) return;

    const isActive = toggleSwitch.classList.contains("active");
    const newValue = !isActive;

    // Update UI
    this.updateToggleUI(toggleSwitch, newValue);
    item.setAttribute("aria-checked", String(newValue));

    // Update config
    this.config[id] = newValue;

    // Persist and notify
    this.saveConfig();
    this.dispatchSettingChange(id, newValue);
  }

  private updateToggleUI(toggleSwitch: HTMLElement, isActive: boolean) {
    if (isActive) {
      toggleSwitch.classList.add("active");
    } else {
      toggleSwitch.classList.remove("active");
    }
  }

  private toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  private openMenu() {
    if (!this.menu || !this.button) return;

    this.menu.classList.add("open");
    this.button.classList.add("active");
    this.button.setAttribute("aria-expanded", "true");
    this.isOpen = true;
  }

  private closeMenu() {
    if (!this.menu || !this.button) return;

    this.menu.classList.remove("open");
    this.button.classList.remove("active");
    this.button.setAttribute("aria-expanded", "false");
    this.isOpen = false;
  }

  private async saveConfig() {
    try {
      await storageBridge.set(STORAGE_KEY, this.config);
    } catch (error) {
      console.warn("Failed to save dropdown config:", error);
    }
  }

  private dispatchSettingChange(setting: ConfigKey, value: boolean) {
    window.dispatchEvent(
      new CustomEvent("yt-enhancer-setting", {
        detail: { setting, value },
      }),
    );
  }

  inject() {
    this.injectButton();
    this.injectMenu();
  }

  private injectButton() {
    const target = document.querySelector<HTMLElement>("#end");
    if (
      target &&
      this.container &&
      !document.querySelector("#yt-enhancer-dropdown")
    ) {
      target.insertAdjacentElement("afterbegin", this.container);
    }
  }

  private injectMenu() {
    if (!this.menu || document.querySelector("#yt-enhancer-menu")) return;

    // Use requestAnimationFrame for better performance
    const waitForPopupContainer = () => {
      const popupContainer = document.querySelector<Element>(
        "ytd-popup-container.style-scope",
      );

      if (popupContainer) {
        popupContainer.appendChild(this.menu!);
      } else {
        requestAnimationFrame(waitForPopupContainer);
      }
    };

    requestAnimationFrame(waitForPopupContainer);
  }

  destroy() {
    // Run all cleanup functions
    this.cleanupFns.forEach((fn) => {
      try {
        fn();
      } catch (error) {
        console.warn("Cleanup error:", error);
      }
    });
    this.cleanupFns = [];

    // Remove DOM elements
    this.container?.remove();
    this.menu?.remove();

    // Clear references
    this.container = null;
    this.button = null;
    this.menu = null;
    this.isOpen = false;
  }

  getConfig(): Readonly<DropdownConfig> {
    return { ...this.config };
  }

  private getSettingsIconSVG(): string {
    return `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/>
      </svg>
    `;
  }
}
