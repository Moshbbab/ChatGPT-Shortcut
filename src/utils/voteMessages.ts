export function voteLoginRequiredText(lang = "en"): string {
  if (lang.startsWith("zh")) return "请先登录以进行投票";
  return "Please sign in to vote";
}

export function voteAlreadyVotedText(lang = "en"): string {
  if (lang.startsWith("zh")) return "你已经对该提示词投过票了";
  return "You have already voted on this prompt";
}

export function voteSuccessText(lang = "en"): string {
  if (lang.startsWith("zh")) return "投票成功！感谢你的反馈";
  return "Vote submitted successfully! Thank you";
}

export function voteFailedText(lang = "en"): string {
  if (lang.startsWith("zh")) return "投票失败，请稍后重试";
  return "Failed to submit vote, please try again later";
}
