import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

class TCLocalizations {
  const TCLocalizations(this.locale);

  final Locale locale;

  static const supportedLocales = [Locale('en'), Locale('si'), Locale('ta')];

  static const _strings = <String, Map<String, String>>{
    'en': {
      'home': 'Home',
      'jobs': 'Jobs',
      'messages': 'Messages',
      'profile': 'Profile',
      'question': 'What happened?',
      'subtitle':
          'Show it, describe it, or just talk — we will figure out the rest.',
      'resolved': 'Resolved',
    },
    'si': {
      'home': 'මුල් පිටුව',
      'jobs': 'සේවා',
      'messages': 'පණිවිඩ',
      'profile': 'ගිණුම',
      'question': 'මොකද වුණේ?',
      'subtitle': 'පෙන්වන්න, විස්තර කරන්න, නැතිනම් කතා කරන්න.',
      'resolved': 'විසඳා ඇත',
    },
    'ta': {
      'home': 'முகப்பு',
      'jobs': 'வேலைகள்',
      'messages': 'செய்திகள்',
      'profile': 'சுயவிவரம்',
      'question': 'என்ன நடந்தது?',
      'subtitle': 'காட்டுங்கள், விவரியுங்கள் அல்லது பேசுங்கள்.',
      'resolved': 'தீர்க்கப்பட்டது',
    },
  };

  String t(String key) =>
      _strings[locale.languageCode]?[key] ?? _strings['en']![key] ?? key;

  static TCLocalizations of(BuildContext context) =>
      Localizations.of<TCLocalizations>(context, TCLocalizations)!;

  static const delegate = _TCDelegate();
}

class _TCDelegate extends LocalizationsDelegate<TCLocalizations> {
  const _TCDelegate();

  @override
  bool isSupported(Locale locale) => TCLocalizations.supportedLocales.any(
    (item) => item.languageCode == locale.languageCode,
  );

  @override
  Future<TCLocalizations> load(Locale locale) =>
      SynchronousFuture(TCLocalizations(locale));

  @override
  bool shouldReload(_TCDelegate old) => false;
}
