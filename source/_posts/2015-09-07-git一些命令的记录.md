title: git一些命令的记录
categories:
  - 技巧
tags:
  - git
  - version control
date: 2015-09-07 20:57:08
---


好久没有更新了，记录下最近的历程吧。

最近入职TW了，然后就飘到印度培训了，生活真的猜不透啊。

在培训期间因为要大量用到git，git 我用的到不少，但是在一个团队中使用还是第一着。

人丑就要多读书，就在此记录下自个的学习旅程吧。

<!--more-->

## git rm 

从工作目录上删除指定文件，当然，这个命令并不仅仅删除你磁盘中的文件，它也将你在git仓库中的文件索引也一并删除。

```bash
—cached 仅从暂存区删除文件
-f 从暂存区和工作目录都删除文件
```

## git commit —amend 

撤销刚才的提交操作，重新书写`commit`信息

而且在这个命令后还可以添加 `--no-edit` 参数，使用后，你就不需要重新定义`commit`信息了，系统会直接使用上一次的`commit`信息，并把当前提交和上一次提交合并成一次提交。

## git revert HEAD 文件名 

取消提交暂存的文件，如果你有文件修改了，并且你将其提交到缓存区了，此时，你突然觉得这个文件的更改都不起作用，你想将这个文件回退到上一次`commit`的状态，你可以使用这个命令将缓存区和工作目录的这个文件都回退到`HEAD`指向的提交版本状态。

## git checkout — 文件名 

取消对文件的修改, 和`git revert HEAD`命令类似，但是作用的范围不一样，`revert`是作用于已经添加到缓存区的文件， 而`checkout`是作用作出更改没有添加到缓存区的文件，使用此命令会将此文件的缓存区版本覆盖其工作目录吧版本。

## git remote add  

添加远程仓库


## git push [remote-name] [branch-name]

针对指定远程仓库，和本地分支名提交。

## git push origin [tagname]

将标签提交到服务仓库

## git push origin —tags 

将所有本地标签上传

## git merge && git rebase 

都是合并分支用的，`merge`会保留分支历史，而`rebase`能生成一个更为整洁的提交历史。在准备提交远程补丁的时候经常使用。

## git rebase [主分支] [特性分支]

一旦分支中的提交对象发布到公共仓库，就千万不要对该分支进行衍合操作。

也就是说不要在主分支上衍合


## git merge-base 主分支 比较分支 

确认两个分支的共同祖先

## git log —graph 

用树状显示log, 可以清楚的在终端下看到分支开发的情况。

## git add -p [file_name] 

根据情况提交变化代码块，还可以根据情况将代码块进一步细分。

## git rebase -i HEAD~[number_of_commits] 

在方括号中指定你想要处理的最近n次提交，然后git会调用默认编辑器打开一个文本类似这样

```bash
pick 700e1c1 修复升序和降序的功能$
pick f7bef77 逻辑写好了,等待测试$
$
# Rebase 8696e74..f7bef77 onto 8696e74 (       2 TODO item(s))$
#$
# Commands:$
# p, pick = use commit$
# r, reword = use commit, but edit the commit message$
# e, edit = use commit, but stop for amending$
# s, squash = use commit, but meld into previous commit$
# f, fixup = like "squash", but discard this commit's log message$

...
```

前两行显示你最近的两次提交，下面是较新的提交。你可以修改每行的pick命令：

```bash
- p,pick 就是该分支保持原样
- r,reword 就是直接打开一个commit提交的文本文件，你可以修改当时的提交内容
- e,edit 和reword，类似，但是不会为你打开文本文件，会暂时退回到指定的提交版本，你需要使用git commit --amend主动修改提交内容，然后使用git rebase --continue衍合
- s，squash 使用这个命令的提交会和其上方的提交，并会打开一个编辑器让你编辑提交内容。
- f，fixup 和squash类似，不会弹出编辑器，直接使用其上方提交的信息，舍弃掉其本身的提交信息。
```

## git stash 

暂存当前所有的更改, 牛B功能，最适合你正在开发一个特性的时候，突然有个紧急需求过来需要尽快解决的情况下使用。

这个命令可以将你目前工作目录和缓存区的所有更改都在本地暂存起来，然后缓存区和工作目录都恢复到HEAD的版本状态下。

希望检查stash列表，你可以运行下面的命令：

-  git stash list

如果你想要解除stash并且恢复未提交的变更，你可以进行apply stash:


-  git stash apply

每个stash都有一个标识符，一个唯一的号码（尽管在这种情况下我们只有一个stash）。如果你只想留有余地进行apply stash，你应该给apply添加特定的标识符：

- git stash apply stash@{2}

## cherry-pick

并没有使用，看使用说明是主要的用处是你在一个分支中开发的时候，你需要另外一个分支的特性，你可以使使用这个命令将其他分支的特定提交整合到你的当前分支中来。

暂时学习成果就这么多，感觉git命令还是很多很实用的并没有掌握，多学才能武功高，自勉。
