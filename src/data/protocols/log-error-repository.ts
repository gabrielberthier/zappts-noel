export interface LogErrorRepository{
  log (errorTrack: string): Promise<void>
}
