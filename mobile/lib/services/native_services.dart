import 'dart:io';

import 'package:geolocator/geolocator.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:record/record.dart';

enum CapabilityState {
  ready,
  denied,
  permanentlyDenied,
  unavailable,
  cancelled,
  failed,
}

class CapabilityResult<T> {
  const CapabilityResult(this.state, {this.value, this.message});
  final CapabilityState state;
  final T? value;
  final String? message;
}

abstract interface class MediaCaptureService {
  Future<CapabilityResult<String>> captureCamera();
  Future<CapabilityResult<String>> selectGallery();
}

class DeviceMediaCaptureService implements MediaCaptureService {
  DeviceMediaCaptureService({ImagePicker? picker})
    : _picker = picker ?? ImagePicker();
  final ImagePicker _picker;

  @override
  Future<CapabilityResult<String>> captureCamera() => _pick(ImageSource.camera);

  @override
  Future<CapabilityResult<String>> selectGallery() =>
      _pick(ImageSource.gallery);

  Future<CapabilityResult<String>> _pick(ImageSource source) async {
    try {
      final file = await _picker.pickImage(
        source: source,
        imageQuality: 88,
        maxWidth: 1600,
      );
      if (file == null) {
        return const CapabilityResult(CapabilityState.cancelled);
      }
      return CapabilityResult(CapabilityState.ready, value: file.path);
    } catch (error) {
      final status = await Permission.camera.status;
      if (status.isPermanentlyDenied) {
        return const CapabilityResult(
          CapabilityState.permanentlyDenied,
          message: 'Camera access is blocked in system settings.',
        );
      }
      if (status.isDenied) {
        return const CapabilityResult(
          CapabilityState.denied,
          message: 'Camera access was denied. You can still use the gallery or text.',
        );
      }
      return CapabilityResult(
        CapabilityState.failed,
        message: error.toString(),
      );
    }
  }
}

abstract interface class RecordingService {
  Future<CapabilityResult<void>> start();
  Future<CapabilityResult<String>> stop();
  Future<void> pause();
  Future<void> resume();
  Future<void> cancel();
}

class DeviceRecordingService implements RecordingService {
  DeviceRecordingService({AudioRecorder? recorder})
    : _recorder = recorder ?? AudioRecorder();
  final AudioRecorder _recorder;

  @override
  Future<CapabilityResult<void>> start() async {
    if (!await _recorder.hasPermission()) {
      return const CapabilityResult(
        CapabilityState.denied,
        message: 'Microphone access is required for voice input.',
      );
    }
    final path =
        '${Directory.systemTemp.path}${Platform.pathSeparator}trustcraft-issue.m4a';
    await _recorder.start(
      const RecordConfig(encoder: AudioEncoder.aacLc),
      path: path,
    );
    return const CapabilityResult(CapabilityState.ready);
  }

  @override
  Future<void> pause() => _recorder.pause();

  @override
  Future<void> resume() => _recorder.resume();

  @override
  Future<CapabilityResult<String>> stop() async {
    final path = await _recorder.stop();
    return path == null
        ? const CapabilityResult(CapabilityState.failed)
        : CapabilityResult(CapabilityState.ready, value: path);
  }

  @override
  Future<void> cancel() => _recorder.cancel();
}

abstract interface class TranscriptionService {
  Future<String> transcribe(String audioPath);
}

class MockTranscriptionService implements TranscriptionService {
  @override
  Future<String> transcribe(String audioPath) async =>
      'There is water leaking from under my kitchen sink. It started this morning.';
}

class LocationService {
  Future<CapabilityResult<Position>> currentPosition() async {
    if (!await Geolocator.isLocationServiceEnabled()) {
      return const CapabilityResult(
        CapabilityState.unavailable,
        message: 'Location is off. Enter your area manually.',
      );
    }
    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }
    if (permission == LocationPermission.denied) {
      return const CapabilityResult(
        CapabilityState.denied,
        message: 'Location denied. Manual location is available.',
      );
    }
    if (permission == LocationPermission.deniedForever) {
      return const CapabilityResult(
        CapabilityState.permanentlyDenied,
        message: 'Location is blocked in system settings.',
      );
    }
    return CapabilityResult(
      CapabilityState.ready,
      value: await Geolocator.getCurrentPosition(),
    );
  }
}
