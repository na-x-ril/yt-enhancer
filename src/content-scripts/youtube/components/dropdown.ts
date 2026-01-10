// src/content-scripts/youtube/components/dropdown.ts
import { storageBridge } from "../bridge/bridge";

interface DropdownConfig {
  autoLoop: boolean;
  qualityService: boolean;
  autoCaption: boolean;
}

const STORAGE_KEY = "dropdown_config";

export class Dropdown {
  private container: HTMLElement | null = null;
  private button: HTMLElement | null = null;
  private menu: HTMLElement | null = null;
  private config: DropdownConfig = {
    autoLoop: true,
    qualityService: true,
    autoCaption: true,
  };
  private isOpen = false;

  async init() {
    // Load config dari storage
    const saved = await storageBridge.get(STORAGE_KEY);
    if (saved) this.config = { ...this.config, ...saved };

    this.createUI();
    this.attachListeners();
  }

  private createUI() {
    // Container untuk button saja
    this.container = document.createElement("div");
    this.container.id = "yt-enhancer-dropdown";
    this.container.style.cssText = `
      position: relative;
      display: inline-block;
      margin-right: 1rem;
    `;

    // Button dengan SVG settings icon
    this.button = document.createElement("button");
    this.button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; transition: transform 0.3s ease;">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/>
      </svg>
    `;
    this.button.style.cssText = `
      background: rgba(255,255,255,.1);
      border: none;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      border-radius: 50%;
    `;

    // Dropdown menu (akan diletakkan di ytd-popup-container)
    this.menu = document.createElement("div");
    this.menu.id = "yt-enhancer-menu";
    this.menu.style.cssText = `
      display: none;
      background: rgba(0,0,0,.8);
      backdrop-filter: blur(8px);
      border: 1px solid #343434;
      position: fixed;
      border-radius: 12px;
      padding: 12px;
      min-width: 220px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.6);
      z-index: 9999;
      top: 5.2rem;
      right: 23rem;
      user-select: none;
    `;

    this.menu.innerHTML = `
      <div style="padding: 8px 12px; font-size: 20px; color: #fff; font-weight: 600; border-bottom: 1px solid #404040; margin-bottom: 12px;">
        YT Enhancer Settings
      </div>
      ${this.createToggleItem("autoLoop", "Auto Loop", this.config.autoLoop)}
      ${this.createToggleItem("qualityService", "Quality Service", this.config.qualityService)}
      ${this.createToggleItem("autoCaption", "Auto Caption", this.config.autoCaption)}
    `;

    this.container.appendChild(this.button);
  }

  private createToggleItem(
    id: string,
    label: string,
    checked: boolean,
  ): string {
    return `
      <div class="toggle-item" data-id="${id}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; cursor: pointer; border-radius: 8px; transition: background 0.2s; margin-bottom: 4px;">
        <span style="color: #fff; font-size: 16px;">${label}</span>
        <div class="toggle-switch ${checked ? "active" : ""}" style="position: relative; width: 44px; height: 24px; background: ${checked ? "#3ea6ff" : "#717171"}; border-radius: 12px; transition: background 0.3s; flex-shrink: 0;">
          <div class="toggle-knob" style="position: absolute; top: 2px; left: ${checked ? "22px" : "2px"}; width: 20px; height: 20px; background: #fff; border-radius: 50%; transition: left 0.3s;"></div>
        </div>
      </div>
    `;
  }

  private attachListeners() {
    // Toggle dropdown dengan rotasi
    this.button?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // Close saat klik di luar
    document.addEventListener("click", () => {
      this.closeMenu();
    });

    // Close saat escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeMenu();
      }
    });

    this.menu?.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Toggle switch handlers
    const toggleItems =
      this.menu?.querySelectorAll<HTMLDivElement>(".toggle-item");
    toggleItems?.forEach((item) => {
      item.addEventListener("click", () => {
        const id = item.getAttribute("data-id");
        if (!id) return;

        const toggleSwitch =
          item.querySelector<HTMLDivElement>(".toggle-switch");
        const toggleKnob = item.querySelector<HTMLDivElement>(".toggle-knob");

        if (!toggleSwitch || !toggleKnob) return;

        const isActive = toggleSwitch.classList.contains("active");
        const newValue = !isActive;

        // Update UI
        if (newValue) {
          toggleSwitch.classList.add("active");
          (toggleSwitch as HTMLElement).style.background = "#3ea6ff";
          toggleKnob.style.left = "22px";
        } else {
          toggleSwitch.classList.remove("active");
          (toggleSwitch as HTMLElement).style.background = "#717171";
          toggleKnob.style.left = "2px";
        }

        // Update config
        if (id === "autoLoop") {
          this.config.autoLoop = newValue;
        } else if (id === "qualityService") {
          this.config.qualityService = newValue;
        } else if (id === "autoCaption") {
          this.config.autoCaption = newValue;
        }

        this.saveConfig();
        this.dispatchEvent(id, newValue);
      });

      // Hover effect
      item.addEventListener("mouseenter", () => {
        (item as HTMLElement).style.background = "rgba(255,255,255,0.1)";
      });
      item.addEventListener("mouseleave", () => {
        (item as HTMLElement).style.background = "transparent";
      });
    });
  }

  private toggleMenu() {
    const svg = this.button?.querySelector<SVGElement>("svg");

    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.menu!.style.display = "block";
      this.isOpen = true;

      // Rotate icon
      if (svg) {
        svg.style.transform = "rotate(45deg)";
      }
    }
  }

  private closeMenu() {
    const svg = this.button?.querySelector<SVGElement>("svg");

    if (this.menu) {
      this.menu.style.display = "none";
      this.isOpen = false;

      // Reset rotation
      if (svg) {
        svg.style.transform = "rotate(0deg)";
      }
    }
  }

  private async saveConfig() {
    await storageBridge.set(STORAGE_KEY, this.config);
  }

  private dispatchEvent(setting: string, value: boolean) {
    window.dispatchEvent(
      new CustomEvent("yt-enhancer-setting", {
        detail: { setting, value },
      }),
    );
  }

  inject() {
    // Inject button ke #end
    const targetButton = document.querySelector<HTMLDivElement>("#end");
    if (targetButton && this.container) {
      targetButton.insertAdjacentElement("afterbegin", this.container);
    }

    // Inject menu ke ytd-popup-container
    const waitForPopupContainer = setInterval(() => {
      const popupContainer = document.querySelector<Element>(
        "ytd-popup-container.style-scope",
      );
      if (popupContainer && this.menu) {
        popupContainer.appendChild(this.menu);
        clearInterval(waitForPopupContainer);
      }
    }, 100);
  }

  destroy() {
    this.container?.remove();
    this.menu?.remove();
    this.container = null;
    this.button = null;
    this.menu = null;
  }

  getConfig() {
    return { ...this.config };
  }
}
