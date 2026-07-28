import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors } from '@/constants/theme';

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
}) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        isPrimary && styles.btnPrimary,
        isOutline && styles.btnOutline,
        variant === 'ghost' && styles.btnGhost,
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : colors.primary} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={isPrimary ? '#fff' : colors.primary}
              style={{ marginRight: 6 }}
            />
          )}
          <Text style={[styles.btnText, !isPrimary && { color: colors.primary }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

export function Chip({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={15}
          color={active ? '#fff' : colors.sub}
          style={{ marginRight: 4 }}
        />
      )}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  hint,
  ...props
}: TextInputProps & { label: string; hint?: string }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        {...props}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 20,
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnOutline: { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: '#fff' },
  btnGhost: { backgroundColor: 'transparent' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 14, color: colors.sub, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.text,
  },
  hint: { fontSize: 12, color: colors.sub, marginTop: 6 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.sub,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 4,
  },
});
