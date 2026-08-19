import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';

import '../theme/tc_theme.dart';

class TCPage extends StatelessWidget {
  const TCPage({
    super.key,
    required this.child,
    this.background = TCColors.canvas,
    this.padding = EdgeInsets.zero,
  });
  final Widget child;
  final Color background;
  final EdgeInsets padding;

  @override
  Widget build(BuildContext context) => ColoredBox(
    color: background,
    child: SafeArea(
      child: Padding(padding: padding, child: child),
    ),
  );
}

class TCScrollPage extends StatelessWidget {
  const TCScrollPage({
    super.key,
    required this.children,
    this.title,
    this.dark = false,
    this.bottom,
  });
  final List<Widget> children;
  final String? title;
  final bool dark;
  final Widget? bottom;

  @override
  Widget build(BuildContext context) {
    final foreground = dark ? Colors.white : TCColors.ink900;
    return Scaffold(
      backgroundColor: dark ? TCColors.ink900 : TCColors.canvas,
      body: SafeArea(
        child: Column(
          children: [
            if (title != null)
              SizedBox(
                height: 56,
                child: Row(
                  children: [
                    const SizedBox(width: 8),
                    Semantics(
                      button: true,
                      label: 'Go back',
                      child: IconButton(
                        tooltip: 'Back',
                        onPressed: () => context.pop(),
                        icon: Icon(
                          Icons.arrow_back_ios_new_rounded,
                          color: foreground,
                          size: 20,
                        ),
                      ),
                    ),
                    Expanded(
                      child: Text(
                        title!,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: foreground,
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(width: 56),
                  ],
                ),
              ),
            Expanded(
              child: ListView(
                keyboardDismissBehavior:
                    ScrollViewKeyboardDismissBehavior.onDrag,
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 32),
                children: children,
              ),
            ),
            if (bottom != null)
              SafeArea(
                top: false,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 10, 24, 18),
                  child: bottom!,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class TCKicker extends StatelessWidget {
  const TCKicker(this.text, {super.key, this.color = TCColors.teal800});
  final String text;
  final Color color;

  @override
  Widget build(BuildContext context) => Text(
    text.toUpperCase(),
    style: context.data.copyWith(
      color: color,
      fontSize: 11,
      fontWeight: FontWeight.w500,
      letterSpacing: 1.6,
    ),
  );
}

class TCDisplay extends StatelessWidget {
  const TCDisplay(
    this.text, {
    super.key,
    this.size = 32,
    this.color = TCColors.ink900,
    this.height = 1.04,
    this.textAlign,
  });
  final String text;
  final double size;
  final Color color;
  final double height;
  final TextAlign? textAlign;

  @override
  Widget build(BuildContext context) => Text(
    text,
    textAlign: textAlign,
    style: context.display.copyWith(
      fontSize: size,
      color: color,
      height: height,
    ),
  );
}

class TCSurface extends StatelessWidget {
  const TCSurface({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.color = Colors.white,
    this.borderColor = TCColors.ink200,
    this.radius = TCRadius.lg,
    this.onTap,
  });
  final Widget child;
  final EdgeInsets padding;
  final Color color;
  final Color borderColor;
  final double radius;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final content = Container(
      padding: padding,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: borderColor),
      ),
      child: child,
    );
    if (onTap == null) return content;
    return Semantics(
      button: true,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(radius),
        child: content,
      ),
    );
  }
}

enum TCButtonStyle { primary, dark, outline, danger }

class TCButton extends StatelessWidget {
  const TCButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.style = TCButtonStyle.primary,
    this.busy = false,
  });
  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final TCButtonStyle style;
  final bool busy;

  @override
  Widget build(BuildContext context) {
    final background = switch (style) {
      TCButtonStyle.primary => TCColors.teal800,
      TCButtonStyle.dark => TCColors.ink900,
      TCButtonStyle.outline => Colors.transparent,
      TCButtonStyle.danger => TCColors.danger700,
    };
    final foreground = style == TCButtonStyle.outline
        ? TCColors.ink700
        : Colors.white;
    return Semantics(
      button: true,
      enabled: onPressed != null && !busy,
      label: label,
      child: SizedBox(
        width: double.infinity,
        height: 56,
        child: FilledButton(
          onPressed: busy ? null : onPressed,
          style: FilledButton.styleFrom(
            backgroundColor: background,
            foregroundColor: foreground,
            disabledBackgroundColor: TCColors.ink200,
            disabledForegroundColor: TCColors.ink400,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: style == TCButtonStyle.outline
                  ? const BorderSide(color: TCColors.ink200)
                  : BorderSide.none,
            ),
          ),
          child: busy
              ? const SizedBox.square(
                  dimension: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Colors.white,
                  ),
                )
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (icon != null) ...[
                      Icon(icon, size: 19),
                      const SizedBox(width: 10),
                    ],
                    Text(
                      label,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}

class TrustBadge extends StatelessWidget {
  const TrustBadge({
    super.key,
    required this.score,
    this.large = false,
    this.onTap,
  });
  final int score;
  final bool large;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) => Semantics(
    button: onTap != null,
    label: 'Trust score $score, excellent and verified',
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: EdgeInsets.symmetric(
              horizontal: large ? 12 : 9,
              vertical: large ? 8 : 6,
            ),
            decoration: BoxDecoration(
              color: TCColors.teal800,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Text(
                  'TRUST ',
                  style: context.data.copyWith(
                    color: Colors.white,
                    fontSize: large ? 12 : 10,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  '$score',
                  style: context.display.copyWith(
                    color: Colors.white,
                    fontSize: large ? 24 : 18,
                    height: 1,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 9),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Excellent',
                style: TextStyle(
                  fontSize: 12,
                  color: TCColors.success700,
                  fontWeight: FontWeight.w700,
                ),
              ),
              Text(
                'Verified',
                style: TextStyle(fontSize: 11, color: TCColors.ink400),
              ),
            ],
          ),
        ],
      ),
    ),
  );
}

class TCInfoRow extends StatelessWidget {
  const TCInfoRow({
    super.key,
    required this.label,
    required this.value,
    this.icon,
    this.valueColor,
  });
  final String label;
  final String value;
  final IconData? icon;
  final Color? valueColor;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 11),
    child: Row(
      children: [
        if (icon != null) ...[
          Icon(icon, size: 18, color: TCColors.teal800),
          const SizedBox(width: 10),
        ],
        Expanded(
          child: Text(
            label,
            style: const TextStyle(color: TCColors.ink400, fontSize: 13),
          ),
        ),
        const SizedBox(width: 12),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: TextStyle(
              color: valueColor ?? TCColors.ink900,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    ),
  );
}

class TCMetric extends StatelessWidget {
  const TCMetric({super.key, required this.value, required this.label});
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        value,
        style: context.data.copyWith(
          color: Colors.white,
          fontSize: 20,
          fontWeight: FontWeight.w500,
        ),
      ),
      Text(label, style: const TextStyle(color: TCColors.ink400, fontSize: 12)),
    ],
  );
}

class TCReveal extends StatelessWidget {
  const TCReveal({super.key, required this.child, this.delay = Duration.zero});
  final Widget child;
  final Duration delay;

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return child;
    return TweenAnimationBuilder<double>(
      duration: TCMotion.reveal + delay,
      curve: TCMotion.curve,
      tween: Tween(begin: 0, end: 1),
      child: child,
      builder: (context, value, child) => Opacity(
        opacity: value,
        child: Transform.translate(
          offset: Offset(0, 14 * (1 - value)),
          child: child,
        ),
      ),
    );
  }
}

Future<void> tcHaptic() => HapticFeedback.selectionClick();
