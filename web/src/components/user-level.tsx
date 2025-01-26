import { useGetUserExperienceAndLevel } from '../http/generated/api'
import { Progress, ProgressIndicator } from './ui/progress-bar'

export function UserLevel() {
  const { data, isLoading: isExperienceLoading } =
    useGetUserExperienceAndLevel()

  if (!data || isExperienceLoading) {
    return 'Carregando...'
  }

  const percentage = Math.round(
    (data.experience * 100) / data.experienceToNextLevel
  )

  return (
    <div className="max-w-[220px] w-full flex flex-col gap-1">
      <div className="w-full flex items-center px-2 justify-between text-xxs text-zinc-200">
        <span>Lvl {data.level}</span>
        <span className="text-zinc-400">
          {data.experience} XP de {data.experienceToNextLevel} XP
        </span>
        <span>{percentage}%</span>
      </div>

      <Progress
        className="bg-zinc-800"
        value={data.experience}
        max={data.experienceToNextLevel}
      >
        <ProgressIndicator style={{ width: `${percentage}%` }} />
      </Progress>
    </div>
  )
}

