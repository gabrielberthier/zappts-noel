export interface LogErrorRepository{
  logError (errorTrack: string): Promise<void>
}
