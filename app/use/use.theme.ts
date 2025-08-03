import { theme, ThemeConfig } from "antd";

export const useTheme = () => {
    const { token } = theme.useToken();
    const result: ThemeConfig = {
        cssVar: true,
        // algorithm: [theme.darkAlgorithm],
        hashed: true,
        token: {
            colorPrimary: "#24b4b1",
            colorBorder: "#24b4b1",
            colorText: "#1f2253",
            colorBgBase: "#fff",
            // colorBgBase: "rgb(224, 224, 224,0.5)",
            colorBgContainer: "#fff",
            colorBgLayout: "#fff",

            // colorPrimaryActive: "#24b4b1",
            // colorBgTextActive: "#24b4b1",
            // colorPrimaryTextActive: "#24b4b1",

            // colorLinkActive: "red",
            // colorBgLayout: "rgba(36, 180, 177, 0.02)",
            // colorBgElevated: "red",
            // colorBgElevated: "rgba(220, 255, 254, 0.1)",
            // colorBgElevated: "#bfeeed",


            // colorBgMask: "green",

            // colorBgBlur: "green",
            // colorBgBase: "#2A3038",
            // colorBgContainer: "#222831",
            controlHeight: 35,
            // colorBgBase: "#1A1A1D",
            // colorPrimary: '#3B82F6', // Primary softer blue color
            // colorLink: '#3B82F6',
            // colorInfo: '#3B82F6',
            // colorSuccess: '#52c41a',
            // colorWarning: '#faad14',
            // colorError: '#DC2626',
            // colorTextBase: '#2c3e50',
            // borderRadius: 8,
            // wireframe: false,
            // fontSize: 14,
            // colorBgContainer: '#ffffff',
            // boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
            // lineWidth: 1,
            // controlHeight: 32,
            // controlHeightLG: 40,
            // controlHeightSM: 24,
            // motionDurationMid: '0.2s',
            // motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
            // colorFillSecondary: '#DBEAFE',
            // colorFillTertiary: '#EFF6FF',
            // colorFillQuaternary: '#ffffff',
            // colorBgLayout: '#f0f2f5',
            // colorBgElevated: '#ffffff',
            // colorBorder: '#E5E7EB', // Soft gray border color

            // colorText: '#1F2937', // Main text color
            // colorTextSecondary: '#4B5563', // Secondary text color
            // colorTextTertiary: '#9CA3AF', // Tertiary text color
            // colorTextDescription: '#6B7280', // Description text color
            // colorBgMask: 'rgba(0, 0, 0, 0.45)', // Background mask

            // colorBgSpotlight: 'rgba(59, 130, 246, 0.85)', // Spotlight background
            // fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            // boxShadowSecondary: '0 6px 16px rgba(0, 0, 0, 0.08)',
            // boxShadowTertiary: '0 1px 2px rgba(0, 0, 0, 0.06)',
            // colorPrimaryHover: '#2563EB', // Primary color hover state
            // colorPrimaryActive: '#1D4ED8', // Primary color active state
            // colorBgContainerDisabled: '#F3F4F6',
            // colorTextDisabled: '#9CA3AF',

            // colorPrimaryBg: '#EBF5FF',
            // colorPrimaryBgHover: '#DBEAFE',
            // colorPrimaryBorder: '#93C5FD',
            // colorPrimaryBorderHover: '#60A5FA',
            // colorPrimaryTextHover: '#2563EB',
            // colorPrimaryTextActive: '#1D4ED8',
            // colorBgTextHover: '#F0F9FF',
            // colorBgTextActive: '#E0F2FE',
            // colorInfoBg: '#F0F9FF',
            // colorInfoBorder: '#BAE6FD',
            // colorBgBase: '#FFFFFF',
            // colorTextPlaceholder: '#94A3B8',
            // colorSplit: '#E2E8F0',
            // colorFillContent: '#F1F5F9',
            // colorFillContentHover: '#E2E8F0',
            // controlOutline: 'rgba(59, 130, 246, 0.2)',
            // controlItemBgHover: '#F1F5F9',
            // controlItemBgActive: '#E2E8F0',
            // colorFillAlter: '#F8FAFC',
        },
        components: {
            Form: {
                itemMarginBottom: 20,
            }
        },
    }
    return result;
};
