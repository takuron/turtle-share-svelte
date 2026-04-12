<script lang="ts">
	/**
	 * Subscription page (Design prototype).
	 * Display available subscription tiers for users.
	 */
	// // 订阅方案页面（设计原型）。展示可供用户选择的订阅方案和等级。
	import { ArrowLeft } from 'lucide-svelte';
</script>

<svelte:head>
	<title>订阅方案 - TurtleShare</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 pt-32 pb-12">
	<div id="tiers" class="mb-10 text-center">
		<h2 class="mb-3 font-display text-4xl font-black tracking-tight text-on-surface">
			选择订阅方案
		</h2>
		<p class="text-lg font-medium text-on-surface-variant">支持作者，解锁更多独家内容与专属权益</p>
	</div>

	<div class="mb-16 space-y-6">
		<!-- Tier 1 -->
		<div
			class="flex flex-col items-center gap-8 rounded-2xl border border-outline-variant/10 bg-surface-lowest p-8 shadow-editorial-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-ambient md:flex-row"
		>
			<div class="flex-[1.5] text-center md:text-left">
				<div class="mb-3 flex flex-col items-center gap-2 md:flex-row">
					<h3 class="font-display text-2xl font-extrabold text-on-surface">
						基础赞助 <span class="text-lg font-bold text-primary">(LEVEL 1)</span>
					</h3>
				</div>
				<p class="max-w-2xl text-base leading-relaxed text-on-surface-variant">
					感谢您的支持！订阅此等级可解锁所有基础付费文章，并获得专属徽章。您的支持是我持续创作的动力。
				</p>
			</div>
			<div
				class="flex min-w-[200px] flex-col items-center gap-4 border-l-0 border-outline-variant/10 md:items-end md:border-l md:pl-8"
			>
				<div class="text-center md:text-right">
					<span class="font-display text-4xl font-black text-on-surface">￥19</span>
					<span class="text-sm font-semibold text-on-surface-variant">/ 月</span>
				</div>
				<button class="btn w-full rounded-full font-bold shadow-lg shadow-primary/20 btn-primary">
					立即订阅
				</button>
			</div>
		</div>

		<!-- Tier 2 -->
		<div
			class="flex flex-col items-center gap-8 rounded-2xl border border-outline-variant/10 bg-surface-lowest p-8 shadow-editorial-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-ambient md:flex-row"
		>
			<div class="flex-[1.5] text-center md:text-left">
				<div class="mb-3 flex flex-col items-center gap-2 md:flex-row">
					<h3 class="font-display text-2xl font-extrabold text-on-surface">
						进阶阅读 <span class="text-lg font-bold text-primary">(LEVEL 5)</span>
					</h3>
				</div>
				<p class="max-w-2xl text-base leading-relaxed text-on-surface-variant">
					获取深度硬核技术文章的阅读权限，包含源码级原理解析、架构设计实战等进阶内容。适合希望深入提升的技术人。
				</p>
			</div>
			<div
				class="flex min-w-[200px] flex-col items-center gap-4 border-l-0 border-outline-variant/10 md:items-end md:border-l md:pl-8"
			>
				<div class="text-center md:text-right">
					<span class="font-display text-4xl font-black text-on-surface">￥49</span>
					<span class="text-sm font-semibold text-on-surface-variant">/ 月</span>
				</div>
				<button class="btn w-full rounded-full font-bold shadow-lg shadow-primary/20 btn-primary">
					立即订阅
				</button>
			</div>
		</div>

		<!-- Tier 3 -->
		<div
			class="flex flex-col items-center gap-8 rounded-2xl border border-outline-variant/10 bg-surface-lowest p-8 shadow-editorial-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-ambient md:flex-row"
		>
			<div class="flex-[1.5] text-center md:text-left">
				<div class="mb-3 flex flex-col items-center gap-2 md:flex-row">
					<h3 class="font-display text-2xl font-extrabold text-on-surface">
						深度交流 <span class="text-lg font-bold text-primary">(LEVEL 10)</span>
					</h3>
				</div>
				<p class="max-w-2xl text-base leading-relaxed text-on-surface-variant">
					包含进阶阅读的所有权益，额外解锁 1-on-1
					技术咨询，每月可进行一次深度连线交流，探讨项目难题或职业规划。
				</p>
			</div>
			<div
				class="flex min-w-[200px] flex-col items-center gap-4 border-l-0 border-outline-variant/10 md:items-end md:border-l md:pl-8"
			>
				<div class="text-center md:text-right">
					<span class="font-display text-4xl font-black text-on-surface">￥199</span>
					<span class="text-sm font-semibold text-on-surface-variant">/ 月</span>
				</div>
				<button class="btn w-full rounded-full font-bold shadow-lg shadow-primary/20 btn-primary">
					立即订阅
				</button>
			</div>
		</div>
	</div>

	<div class="mb-12 text-center">
		<a
			href="/"
			class="flex items-center justify-center gap-1 text-sm font-bold text-primary hover:underline"
		>
			<ArrowLeft size={16} />
			返回主页
		</a>
	</div>
</div>
