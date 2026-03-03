import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { AppIcon } from "@/components/ui/app-icon";
import { ThemedText } from "@/components/themed-text";
import { FontFamilies } from "@/constants/theme";
import {
  terminals,
  currencies,
  languages,
  type Terminal,
} from "@/constants/terminals";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedTerminal: string;
  onTerminalChange: (id: string) => void;
  selectedCurrency: string;
  onCurrencyChange: (id: string) => void;
  selectedLanguage: string;
  onLanguageChange: (id: string) => void;
};

type PickerType = "terminal" | "currency" | "language" | null;

export function MobileMenuSheet({
  visible,
  onClose,
  selectedTerminal,
  onTerminalChange,
  selectedCurrency,
  onCurrencyChange,
  selectedLanguage,
  onLanguageChange,
}: Props) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [pickerType, setPickerType] = useState<PickerType>(null);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const terminalObj = terminals.find((t) => t.id === selectedTerminal);
  const currencyLabel =
    currencies.find((c) => c.id === selectedCurrency)?.label ?? "PHP (₱)";
  const langObj = languages.find((l) => l.id === selectedLanguage);

  return (
    <>
      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        onDismiss={handleDismiss}
        handleIndicatorStyle={s.handleIndicator}
        backgroundStyle={s.sheetBackground}
      >
        <BottomSheetView style={s.menuList}>
          <MenuRow
            label={terminalObj?.name ?? "Select Terminal"}
            onPress={() => setPickerType("terminal")}
          />
          <MenuRow
            label={currencyLabel}
            onPress={() => setPickerType("currency")}
          />
          <MenuRow
            flag={langObj?.flag ?? "🇵🇭"}
            label={langObj?.label ?? "English"}
            onPress={() => setPickerType("language")}
          />

          <Pressable
            style={s.okayBtn}
            onPress={() => sheetRef.current?.dismiss()}
          >
            <ThemedText style={s.okayBtnText}>Okay</ThemedText>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>

      {/* Native Modal dialogs for sub-pickers */}
      <PickerDialog
        visible={pickerType === "terminal"}
        title="Select terminal"
        onClose={() => setPickerType(null)}
      >
        {terminals.map((t) => (
          <TerminalOption
            key={t.id}
            terminal={t}
            selected={t.id === selectedTerminal}
            onPress={() => {
              onTerminalChange(t.id);
              setPickerType(null);
            }}
          />
        ))}
      </PickerDialog>

      <PickerDialog
        visible={pickerType === "currency"}
        title="Select currency"
        onClose={() => setPickerType(null)}
      >
        {currencies.map((c) => (
          <PickerOption
            key={c.id}
            label={c.label}
            selected={c.id === selectedCurrency}
            onPress={() => {
              onCurrencyChange(c.id);
              setPickerType(null);
            }}
          />
        ))}
      </PickerDialog>

      <PickerDialog
        visible={pickerType === "language"}
        title="Select language"
        onClose={() => setPickerType(null)}
      >
        {languages.map((l) => (
          <PickerOption
            key={l.id}
            label={`${l.flag}  ${l.label}`}
            selected={l.id === selectedLanguage}
            onPress={() => {
              onLanguageChange(l.id);
              setPickerType(null);
            }}
          />
        ))}
      </PickerDialog>
    </>
  );
}

function MenuRow({
  label,
  flag,
  onPress,
}: {
  label: string;
  flag?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [s.menuRow, pressed && s.menuRowPressed]}
      onPress={onPress}
    >
      <View style={s.menuRowLeft}>
        {flag ? <ThemedText style={s.flag}>{flag}</ThemedText> : null}
        <ThemedText style={s.menuRowLabel} numberOfLines={1}>
          {label}
        </ThemedText>
      </View>
      <AppIcon name="chevron-right" size={20} color="#9ca3af" />
    </Pressable>
  );
}

function PickerDialog({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={s.dialogOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={s.dialogCard}>
          <View style={s.dialogHeader}>
            <ThemedText style={s.dialogTitle}>{title}</ThemedText>
          </View>
          <ScrollView
            style={s.dialogScroll}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function PickerOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        s.pickerOption,
        selected && s.pickerOptionSelected,
        pressed && s.menuRowPressed,
      ]}
      onPress={onPress}
    >
      <ThemedText
        style={[s.pickerOptionText, selected && s.pickerOptionTextSelected]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function TerminalOption({
  terminal,
  selected,
  onPress,
}: {
  terminal: Terminal;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        s.pickerOption,
        selected && s.pickerOptionSelected,
        pressed && s.menuRowPressed,
      ]}
      onPress={onPress}
    >
      <ThemedText
        style={[s.pickerOptionText, selected && s.pickerOptionTextSelected]}
      >
        {terminal.name} ({terminal.code})
      </ThemedText>
      <ThemedText style={s.terminalCity}>{terminal.city}</ThemedText>
    </Pressable>
  );
}

const PRIMARY = "#1130bc";

const s = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleIndicator: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  menuList: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 4,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  menuRowPressed: {
    backgroundColor: "#f4f4f5",
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  menuRowLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 16,
    color: "#1e1e1e",
    flexShrink: 1,
  },
  flag: {
    fontSize: 20,
  },
  okayBtn: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 4,
  },
  okayBtnText: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 16,
    color: "#fff",
  },

  dialogOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 24,
  },
  dialogCard: {
    width: "100%",
    maxHeight: SCREEN_HEIGHT * 0.6,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  dialogHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dialogTitle: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 18,
    color: "#1e1e1e",
  },
  dialogScroll: {
    paddingVertical: 8,
  },
  pickerOption: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  pickerOptionSelected: {
    backgroundColor: "rgba(17,48,188,0.1)",
  },
  pickerOptionText: {
    fontFamily: FontFamilies.body,
    fontSize: 16,
    color: "#1e1e1e",
  },
  pickerOptionTextSelected: {
    fontFamily: FontFamilies.bodyBold,
    color: PRIMARY,
  },
  terminalCity: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 2,
  },
});
